module.exports = {
    "env": {
        "browser": true,
        "es6": true,
        "jest/globals": true
    },
    "extends": ["eslint:recommended", "airbnb-base"],
    "parser": "babel-eslint",
    "plugins": [
        "jest"
    ],
    "rules": {
        "no-plusplus": "off",
        "no-nested-ternary": "off",

        "no-underscore-dangle": ["error", { "allowAfterThis": true }],

        "no-restricted-syntax": [
            "error",
            { "selector": "MethodDefinition[kind='set']", "message": "Property setters are not allowed" },
            { "selector": "MethodDefinition[kind='get']", "message": "Property getters are not allowed" }
        ],
    }
};
