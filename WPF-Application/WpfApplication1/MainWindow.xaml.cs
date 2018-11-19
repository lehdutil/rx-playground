using Newtonsoft.Json;
using System;
using System.Net.Http;
using System.Reactive;
using System.Reactive.Concurrency;
using System.Reactive.Linq;
using System.Threading;
using System.Threading.Tasks;
using System.Windows.Controls;

namespace WpfApplication1
{
    /// <summary>
    /// Interaction logic for MainWindow.xaml
    /// </summary>
    public partial class MainWindow
    {
        public MainWindow()
        {
            InitializeComponent();

            var amountStream = Observable.FromEventPattern<TextChangedEventArgs>(amount, "TextChanged")
                .Select(x => (x.Sender as TextBox).Text)
                .Where(x => int.TryParse(x, out var result))
                .Select(int.Parse)
                .Where(x => x > 0)
                .Throttle(TimeSpan.FromMilliseconds(100))
                .ObserveOn(SynchronizationContext.Current);

            var currencySelectionStream =
                Observable.FromEventPattern(radioUSD, "Checked")
                .Merge( Observable.FromEventPattern(radioGBP, "Checked") )
                .Merge( Observable.FromEventPattern(radioEUR, "Checked") )
                .Merge( Observable.FromEventPattern(radioDEN, "Checked") )
                .Merge( Observable.FromEventPattern(radioBTC, "Checked") )
                .Select(x => (x.Sender as RadioButton)?.Content.ToString())
                .ObserveOn(SynchronizationContext.Current);

            amountStream.CombineLatest(currencySelectionStream,
                    (amount, currency) => new {Amount = amount, Currency = currency})
                .DistinctUntilChanged()
                .SubscribeOn(NewThreadScheduler.Default)
                .SelectMany(x => Observable.FromAsync(a => ConvertAmount(x.Currency, x.Amount)))
                .ObserveOn(SynchronizationContext.Current)
                .Subscribe(result =>
                {
                     PrependToLog($"Rx: result {result}");
                     convertedAmounth.Text = result.ToString();
                }, 
                    error => PrependToLog($"error in stream {error.Message}"), 
                    () => PrependToLog("Stream completed") 
                 ); 
                ;

        }

        private void PrependToLog( string text)
        {
            debugLog.Text = text + Environment.NewLine + debugLog.Text;
        }

        private void TextBox_TextChanged(object sender, TextChangedEventArgs e)
        {
            debugLog.Text = amount.Text + Environment.NewLine + debugLog.Text ;
        }

        private void Button_Click_Increment(object sender, System.Windows.RoutedEventArgs e)
        {
            var tbValue = amount.Text; 
            if( int.TryParse( tbValue.Trim(), out int parsedValue )) {
                amount.Text = (++parsedValue).ToString();
            }
        }

        private void Button_Click_Decrement(object sender, System.Windows.RoutedEventArgs e)
        {
            var tbValue = amount.Text;
            if (int.TryParse(tbValue.Trim(), out int parsedValue))
            {
                amount.Text = (--parsedValue).ToString();
            }
        }

        private void RadioButton_Checked(object sender, System.Windows.RoutedEventArgs e)
        {
            return;
            if( sender is RadioButton radioButton )
            {
                var currency = radioButton.Content.ToString();
                debugLog.Text = currency + Environment.NewLine + debugLog.Text;
                if (int.TryParse(amount.Text.Trim(), out int parsedAmount))
                {
                    Task.Run(async () => {
                    var convertedAmount = await ConvertAmount(currency, parsedAmount);
                    Dispatcher.Invoke(() => {
                        debugLog.Text = "converted amount: "  + convertedAmount  + Environment.NewLine + debugLog.Text;
                        convertedAmounth.Text = convertedAmount.ToString();
                    });
                    });
                }
            }
        }

        private async Task<double> ConvertAmount(string targetCurrency, int amount )
        {
            var result = 0d;
            using( var client = new HttpClient())
            {
                var response = await client.GetStringAsync(  $"http://localhost:3000/convert/usd/{targetCurrency}/{amount}"   ); // sends GET request 
                result = JsonConvert.DeserializeObject<ConvertedResult>(response).Result;
            }
            return result;
        }
    }

    internal class ConvertedResult
    {
        public string From { get; set; }
        public string To { get; set; }
        public double Amount { get; set; }
        public double Result { get; set; }
    }
}