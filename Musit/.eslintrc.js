module.exports = {
    "env": {
        "browser": true,
        "es6": true,
        "node": true
    },
    "extends": ["eslint:recommended", "plugin:react/recommended"],
    "parser": "babel-eslint",
    "parserOptions": {
        "ecmaFeatures": {
            "experimentalObjectRestSpread": true,
            "jsx": true
        },
        "sourceType": "module"
    },
    "plugins": [
        "react",
        "react-native"
    ],
    "rules": {
      "no-var": "error",
      "no-unused-vars": ["error", { "args": "none"}],
      "no-console": 0,
        "react/jsx-wrap-multilines": 2,
      "react/jsx-indent-props": [2, 2],
      "react/jsx-indent": [2, 2],
      "react/jsx-closing-bracket-location": 2,
      "react/jsx-tag-spacing": [2, {"closingSlash": "never", "beforeSelfClosing": "never", "afterOpening": "never"}],
      "react/jsx-max-props-per-line": [2, {"maximum": 1, "when": "multiline"}],
      "react/jsx-first-prop-new-line": [2, "multiline"],
        "indent": [
            "error",
            2,
          {"MemberExpression": 1}
        ],
        "linebreak-style": [
            "error",
            "unix"
        ],
        "quotes": [
            "error",
            "double"
        ],
        "semi": [
            "error",
            "always"
        ]
    }
};