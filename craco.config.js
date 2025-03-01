const path = require("path");

module.exports = {
  webpack: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
    configure: {
      ignoreWarnings: [
        /Failed to parse source map/,
        /Module Warning/,
        function ignoreSourcemapsloaderWarnings(warning) {
          return warning.module?.resource?.includes('html5-qrcode') &&
                 warning.message?.includes('source-map-loader');
        },
      ],
    },
  },
};
