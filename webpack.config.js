module.exports = {
    entry: "./main",
    output: { filename: "app.js"}, 
    module: { 
        rules: [
            {
                test: /.tsx?$/,
                use: 'ts-loader',
                exclude: '/node_modules/'
                
            }
        ]
    },
    resolve: {
        extensions: [".tsx", ".ts", ".js"]
    } ,
    mode: 'development'
}