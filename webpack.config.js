const config = {
    mode: "development", // "production" | "development" | "none"
    resolve: {
      extensions: ["*", ".mjs", ".js", ".json", ".scss", ".sass", ".css"],
    },
    module: {
      rules: [
        {
          test: /\.mjs$/,
          include: /node_modules/,
          type: "javascript/auto",
        },
        {
          test: /\.(sass|css|less)$/,
          use: [
          'style-loader', 
          'css-loader',
         'sass-loader', 
        //  'less-loader'
        ],
          exclude: /node_modules/,
        },
      ],
    },
  };
  
  module.exports = config;
  