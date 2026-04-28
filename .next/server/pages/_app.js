/*
 * ATTENTION: An "eval-source-map" devtool has been used.
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file with attached SourceMaps in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
(() => {
var exports = {};
exports.id = "pages/_app";
exports.ids = ["pages/_app"];
exports.modules = {

/***/ "./components/WalletProvider.tsx":
/*!***************************************!*\
  !*** ./components/WalletProvider.tsx ***!
  \***************************************/
/***/ ((module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {\n__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   WalletProvider: () => (/* binding */ WalletProvider),\n/* harmony export */   useWalletState: () => (/* binding */ useWalletState)\n/* harmony export */ });\n/* harmony import */ var react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react/jsx-dev-runtime */ \"react/jsx-dev-runtime\");\n/* harmony import */ var react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react */ \"react\");\n/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_1__);\n/* harmony import */ var _solana_web3_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @solana/web3.js */ \"@solana/web3.js\");\n/* harmony import */ var _solana_web3_js__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_solana_web3_js__WEBPACK_IMPORTED_MODULE_2__);\n/* harmony import */ var tweetnacl__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! tweetnacl */ \"tweetnacl\");\n/* harmony import */ var tweetnacl__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(tweetnacl__WEBPACK_IMPORTED_MODULE_3__);\n/* harmony import */ var bs58__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! bs58 */ \"bs58\");\nvar __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([bs58__WEBPACK_IMPORTED_MODULE_4__]);\nbs58__WEBPACK_IMPORTED_MODULE_4__ = (__webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__)[0];\n\n\n\n\n\nconst WalletStateContext = /*#__PURE__*/ (0,react__WEBPACK_IMPORTED_MODULE_1__.createContext)({});\nconst useWalletState = ()=>(0,react__WEBPACK_IMPORTED_MODULE_1__.useContext)(WalletStateContext);\nconst PHANTOM_URL = \"https://phantom.app/ul/v1/connect\";\nfunction WalletProvider({ children }) {\n    const [publicKey, setPublicKey] = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)(null);\n    const [balance, setBalance] = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)(null);\n    const [connected, setConnected] = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)(false);\n    const [connection] = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)(new _solana_web3_js__WEBPACK_IMPORTED_MODULE_2__.Connection((0,_solana_web3_js__WEBPACK_IMPORTED_MODULE_2__.clusterApiUrl)(\"devnet\"), \"confirmed\"));\n    // 🔐 keys\n    const [dappKeyPair] = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)(tweetnacl__WEBPACK_IMPORTED_MODULE_3___default().box.keyPair());\n    // ✅ handle redirect from Phantom\n    (0,react__WEBPACK_IMPORTED_MODULE_1__.useEffect)(()=>{\n        const params = new URLSearchParams(window.location.search);\n        const phantomPubKey = params.get(\"phantom_encryption_public_key\");\n        const data = params.get(\"data\");\n        const nonce = params.get(\"nonce\");\n        if (!phantomPubKey || !data || !nonce) return;\n        try {\n            const decrypted = tweetnacl__WEBPACK_IMPORTED_MODULE_3___default().box.open(bs58__WEBPACK_IMPORTED_MODULE_4__[\"default\"].decode(data), bs58__WEBPACK_IMPORTED_MODULE_4__[\"default\"].decode(nonce), bs58__WEBPACK_IMPORTED_MODULE_4__[\"default\"].decode(phantomPubKey), dappKeyPair.secretKey);\n            if (!decrypted) throw new Error(\"Decryption failed\");\n            const decoded = JSON.parse(Buffer.from(decrypted).toString());\n            const walletPubKey = decoded.public_key;\n            setPublicKey(walletPubKey);\n            setConnected(true);\n            fetchBalance(walletPubKey);\n            // 🔥 نظف URL\n            window.history.replaceState({}, document.title, window.location.pathname);\n        } catch (err) {\n            console.error(\"Decryption error:\", err);\n        }\n    }, []);\n    const fetchBalance = async (pubKey)=>{\n        try {\n            const lamports = await connection.getBalance(new _solana_web3_js__WEBPACK_IMPORTED_MODULE_2__.PublicKey(pubKey));\n            setBalance(lamports / 1e9);\n        } catch  {\n            setBalance(null);\n        }\n    };\n    // 🚀 connect (REAL mobile deep link)\n    const connect = ()=>{\n        const params = new URLSearchParams({\n            dapp_encryption_public_key: bs58__WEBPACK_IMPORTED_MODULE_4__[\"default\"].encode(dappKeyPair.publicKey),\n            cluster: \"devnet\",\n            app_url: window.location.origin,\n            redirect_link: window.location.href\n        });\n        window.location.href = `${PHANTOM_URL}?${params.toString()}`;\n    };\n    const disconnect = ()=>{\n        setPublicKey(null);\n        setConnected(false);\n        setBalance(null);\n    };\n    return /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(WalletStateContext.Provider, {\n        value: {\n            publicKey,\n            balance,\n            connected,\n            connect,\n            disconnect\n        },\n        children: children\n    }, void 0, false, {\n        fileName: \"C:\\\\Users\\\\moham\\\\Downloads\\\\wallet\\\\components\\\\WalletProvider.tsx\",\n        lineNumber: 95,\n        columnNumber: 5\n    }, this);\n}\n\n__webpack_async_result__();\n} catch(e) { __webpack_async_result__(e); } });//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,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UTtRQUNGO2tCQUVDckQ7Ozs7OztBQUdQIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vcGhhbnRvbS1tb2JpbGUtd2FsbGV0Ly4vY29tcG9uZW50cy9XYWxsZXRQcm92aWRlci50c3g/NTVjZiJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyB1c2VTdGF0ZSwgdXNlRWZmZWN0LCBjcmVhdGVDb250ZXh0LCB1c2VDb250ZXh0IH0gZnJvbSAncmVhY3QnXG5pbXBvcnQgeyBDb25uZWN0aW9uLCBjbHVzdGVyQXBpVXJsLCBQdWJsaWNLZXkgfSBmcm9tICdAc29sYW5hL3dlYjMuanMnXG5pbXBvcnQgbmFjbCBmcm9tICd0d2VldG5hY2wnXG5pbXBvcnQgYnM1OCBmcm9tICdiczU4J1xuXG5pbnRlcmZhY2UgV2FsbGV0U3RhdGUge1xuICBwdWJsaWNLZXk6IHN0cmluZyB8IG51bGxcbiAgYmFsYW5jZTogbnVtYmVyIHwgbnVsbFxuICBjb25uZWN0ZWQ6IGJvb2xlYW5cbiAgY29ubmVjdDogKCkgPT4gdm9pZFxuICBkaXNjb25uZWN0OiAoKSA9PiB2b2lkXG59XG5cbmNvbnN0IFdhbGxldFN0YXRlQ29udGV4dCA9IGNyZWF0ZUNvbnRleHQ8V2FsbGV0U3RhdGU+KHt9IGFzIFdhbGxldFN0YXRlKVxuZXhwb3J0IGNvbnN0IHVzZVdhbGxldFN0YXRlID0gKCkgPT4gdXNlQ29udGV4dChXYWxsZXRTdGF0ZUNvbnRleHQpXG5cbmNvbnN0IFBIQU5UT01fVVJMID0gJ2h0dHBzOi8vcGhhbnRvbS5hcHAvdWwvdjEvY29ubmVjdCdcblxuZXhwb3J0IGZ1bmN0aW9uIFdhbGxldFByb3ZpZGVyKHsgY2hpbGRyZW4gfTogeyBjaGlsZHJlbjogUmVhY3QuUmVhY3ROb2RlIH0pIHtcbiAgY29uc3QgW3B1YmxpY0tleSwgc2V0UHVibGljS2V5XSA9IHVzZVN0YXRlPHN0cmluZyB8IG51bGw+KG51bGwpXG4gIGNvbnN0IFtiYWxhbmNlLCBzZXRCYWxhbmNlXSA9IHVzZVN0YXRlPG51bWJlciB8IG51bGw+KG51bGwpXG4gIGNvbnN0IFtjb25uZWN0ZWQsIHNldENvbm5lY3RlZF0gPSB1c2VTdGF0ZShmYWxzZSlcblxuICBjb25zdCBbY29ubmVjdGlvbl0gPSB1c2VTdGF0ZShcbiAgICBuZXcgQ29ubmVjdGlvbihjbHVzdGVyQXBpVXJsKCdkZXZuZXQnKSwgJ2NvbmZpcm1lZCcpXG4gIClcblxuICAvLyDwn5SQIGtleXNcbiAgY29uc3QgW2RhcHBLZXlQYWlyXSA9IHVzZVN0YXRlKG5hY2wuYm94LmtleVBhaXIoKSlcblxuICAvLyDinIUgaGFuZGxlIHJlZGlyZWN0IGZyb20gUGhhbnRvbVxuICB1c2VFZmZlY3QoKCkgPT4ge1xuICAgIGNvbnN0IHBhcmFtcyA9IG5ldyBVUkxTZWFyY2hQYXJhbXMod2luZG93LmxvY2F0aW9uLnNlYXJjaClcblxuICAgIGNvbnN0IHBoYW50b21QdWJLZXkgPSBwYXJhbXMuZ2V0KCdwaGFudG9tX2VuY3J5cHRpb25fcHVibGljX2tleScpXG4gICAgY29uc3QgZGF0YSA9IHBhcmFtcy5nZXQoJ2RhdGEnKVxuICAgIGNvbnN0IG5vbmNlID0gcGFyYW1zLmdldCgnbm9uY2UnKVxuXG4gICAgaWYgKCFwaGFudG9tUHViS2V5IHx8ICFkYXRhIHx8ICFub25jZSkgcmV0dXJuXG5cbiAgICB0cnkge1xuICAgICAgY29uc3QgZGVjcnlwdGVkID0gbmFjbC5ib3gub3BlbihcbiAgICAgICAgYnM1OC5kZWNvZGUoZGF0YSksXG4gICAgICAgIGJzNTguZGVjb2RlKG5vbmNlKSxcbiAgICAgICAgYnM1OC5kZWNvZGUocGhhbnRvbVB1YktleSksXG4gICAgICAgIGRhcHBLZXlQYWlyLnNlY3JldEtleVxuICAgICAgKVxuXG4gICAgICBpZiAoIWRlY3J5cHRlZCkgdGhyb3cgbmV3IEVycm9yKCdEZWNyeXB0aW9uIGZhaWxlZCcpXG5cbiAgICAgIGNvbnN0IGRlY29kZWQgPSBKU09OLnBhcnNlKEJ1ZmZlci5mcm9tKGRlY3J5cHRlZCkudG9TdHJpbmcoKSlcblxuICAgICAgY29uc3Qgd2FsbGV0UHViS2V5ID0gZGVjb2RlZC5wdWJsaWNfa2V5XG5cbiAgICAgIHNldFB1YmxpY0tleSh3YWxsZXRQdWJLZXkpXG4gICAgICBzZXRDb25uZWN0ZWQodHJ1ZSlcblxuICAgICAgZmV0Y2hCYWxhbmNlKHdhbGxldFB1YktleSlcblxuICAgICAgLy8g8J+UpSDZhti42YEgVVJMXG4gICAgICB3aW5kb3cuaGlzdG9yeS5yZXBsYWNlU3RhdGUoe30sIGRvY3VtZW50LnRpdGxlLCB3aW5kb3cubG9jYXRpb24ucGF0aG5hbWUpXG4gICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICBjb25zb2xlLmVycm9yKCdEZWNyeXB0aW9uIGVycm9yOicsIGVycilcbiAgICB9XG4gIH0sIFtdKVxuXG4gIGNvbnN0IGZldGNoQmFsYW5jZSA9IGFzeW5jIChwdWJLZXk6IHN0cmluZykgPT4ge1xuICAgIHRyeSB7XG4gICAgICBjb25zdCBsYW1wb3J0cyA9IGF3YWl0IGNvbm5lY3Rpb24uZ2V0QmFsYW5jZShuZXcgUHVibGljS2V5KHB1YktleSkpXG4gICAgICBzZXRCYWxhbmNlKGxhbXBvcnRzIC8gMWU5KVxuICAgIH0gY2F0Y2gge1xuICAgICAgc2V0QmFsYW5jZShudWxsKVxuICAgIH1cbiAgfVxuXG4gIC8vIPCfmoAgY29ubmVjdCAoUkVBTCBtb2JpbGUgZGVlcCBsaW5rKVxuICBjb25zdCBjb25uZWN0ID0gKCkgPT4ge1xuICAgIGNvbnN0IHBhcmFtcyA9IG5ldyBVUkxTZWFyY2hQYXJhbXMoe1xuICAgICAgZGFwcF9lbmNyeXB0aW9uX3B1YmxpY19rZXk6IGJzNTguZW5jb2RlKGRhcHBLZXlQYWlyLnB1YmxpY0tleSksXG4gICAgICBjbHVzdGVyOiAnZGV2bmV0JyxcbiAgICAgIGFwcF91cmw6IHdpbmRvdy5sb2NhdGlvbi5vcmlnaW4sXG4gICAgICByZWRpcmVjdF9saW5rOiB3aW5kb3cubG9jYXRpb24uaHJlZixcbiAgICB9KVxuXG4gICAgd2luZG93LmxvY2F0aW9uLmhyZWYgPSBgJHtQSEFOVE9NX1VSTH0/JHtwYXJhbXMudG9TdHJpbmcoKX1gXG4gIH1cblxuICBjb25zdCBkaXNjb25uZWN0ID0gKCkgPT4ge1xuICAgIHNldFB1YmxpY0tleShudWxsKVxuICAgIHNldENvbm5lY3RlZChmYWxzZSlcbiAgICBzZXRCYWxhbmNlKG51bGwpXG4gIH1cblxuICByZXR1cm4gKFxuICAgIDxXYWxsZXRTdGF0ZUNvbnRleHQuUHJvdmlkZXJcbiAgICAgIHZhbHVlPXt7XG4gICAgICAgIHB1YmxpY0tleSxcbiAgICAgICAgYmFsYW5jZSxcbiAgICAgICAgY29ubmVjdGVkLFxuICAgICAgICBjb25uZWN0LFxuICAgICAgICBkaXNjb25uZWN0LFxuICAgICAgfX1cbiAgICA+XG4gICAgICB7Y2hpbGRyZW59XG4gICAgPC9XYWxsZXRTdGF0ZUNvbnRleHQuUHJvdmlkZXI+XG4gIClcbn0iXSwibmFtZXMiOlsidXNlU3RhdGUiLCJ1c2VFZmZlY3QiLCJjcmVhdGVDb250ZXh0IiwidXNlQ29udGV4dCIsIkNvbm5lY3Rpb24iLCJjbHVzdGVyQXBpVXJsIiwiUHVibGljS2V5IiwibmFjbCIsImJzNTgiLCJXYWxsZXRTdGF0ZUNvbnRleHQiLCJ1c2VXYWxsZXRTdGF0ZSIsIlBIQU5UT01fVVJMIiwiV2FsbGV0UHJvdmlkZXIiLCJjaGlsZHJlbiIsInB1YmxpY0tleSIsInNldFB1YmxpY0tleSIsImJhbGFuY2UiLCJzZXRCYWxhbmNlIiwiY29ubmVjdGVkIiwic2V0Q29ubmVjdGVkIiwiY29ubmVjdGlvbiIsImRhcHBLZXlQYWlyIiwiYm94Iiwia2V5UGFpciIsInBhcmFtcyIsIlVSTFNlYXJjaFBhcmFtcyIsIndpbmRvdyIsImxvY2F0aW9uIiwic2VhcmNoIiwicGhhbnRvbVB1YktleSIsImdldCIsImRhdGEiLCJub25jZSIsImRlY3J5cHRlZCIsIm9wZW4iLCJkZWNvZGUiLCJzZWNyZXRLZXkiLCJFcnJvciIsImRlY29kZWQiLCJKU09OIiwicGFyc2UiLCJCdWZmZXIiLCJmcm9tIiwidG9TdHJpbmciLCJ3YWxsZXRQdWJLZXkiLCJwdWJsaWNfa2V5IiwiZmV0Y2hCYWxhbmNlIiwiaGlzdG9yeSIsInJlcGxhY2VTdGF0ZSIsImRvY3VtZW50IiwidGl0bGUiLCJwYXRobmFtZSIsImVyciIsImNvbnNvbGUiLCJlcnJvciIsInB1YktleSIsImxhbXBvcnRzIiwiZ2V0QmFsYW5jZSIsImNvbm5lY3QiLCJkYXBwX2VuY3J5cHRpb25fcHVibGljX2tleSIsImVuY29kZSIsImNsdXN0ZXIiLCJhcHBfdXJsIiwib3JpZ2luIiwicmVkaXJlY3RfbGluayIsImhyZWYiLCJkaXNjb25uZWN0IiwiUHJvdmlkZXIiLCJ2YWx1ZSJdLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///./components/WalletProvider.tsx\n");

/***/ }),

/***/ "./pages/_app.tsx":
/*!************************!*\
  !*** ./pages/_app.tsx ***!
  \************************/
/***/ ((module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {\n__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (/* binding */ App)\n/* harmony export */ });\n/* harmony import */ var react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react/jsx-dev-runtime */ \"react/jsx-dev-runtime\");\n/* harmony import */ var react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var _components_WalletProvider__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../components/WalletProvider */ \"./components/WalletProvider.tsx\");\n/* harmony import */ var _styles_globals_css__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../styles/globals.css */ \"./styles/globals.css\");\n/* harmony import */ var _styles_globals_css__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_styles_globals_css__WEBPACK_IMPORTED_MODULE_2__);\nvar __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([_components_WalletProvider__WEBPACK_IMPORTED_MODULE_1__]);\n_components_WalletProvider__WEBPACK_IMPORTED_MODULE_1__ = (__webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__)[0];\n\n\n\nfunction App({ Component, pageProps }) {\n    return /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(_components_WalletProvider__WEBPACK_IMPORTED_MODULE_1__.WalletProvider, {\n        children: /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(Component, {\n            ...pageProps\n        }, void 0, false, {\n            fileName: \"C:\\\\Users\\\\moham\\\\Downloads\\\\wallet\\\\pages\\\\_app.tsx\",\n            lineNumber: 8,\n            columnNumber: 7\n        }, this)\n    }, void 0, false, {\n        fileName: \"C:\\\\Users\\\\moham\\\\Downloads\\\\wallet\\\\pages\\\\_app.tsx\",\n        lineNumber: 7,\n        columnNumber: 5\n    }, this);\n}\n\n__webpack_async_result__();\n} catch(e) { __webpack_async_result__(e); } });//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9wYWdlcy9fYXBwLnRzeCIsIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7O0FBQzZEO0FBQy9CO0FBRWYsU0FBU0MsSUFBSSxFQUFFQyxTQUFTLEVBQUVDLFNBQVMsRUFBWTtJQUM1RCxxQkFDRSw4REFBQ0gsc0VBQWNBO2tCQUNiLDRFQUFDRTtZQUFXLEdBQUdDLFNBQVM7Ozs7Ozs7Ozs7O0FBRzlCIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vcGhhbnRvbS1tb2JpbGUtd2FsbGV0Ly4vcGFnZXMvX2FwcC50c3g/MmZiZSJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgdHlwZSB7IEFwcFByb3BzIH0gZnJvbSAnbmV4dC9hcHAnXG5pbXBvcnQgeyBXYWxsZXRQcm92aWRlciB9IGZyb20gJy4uL2NvbXBvbmVudHMvV2FsbGV0UHJvdmlkZXInXG5pbXBvcnQgJy4uL3N0eWxlcy9nbG9iYWxzLmNzcydcblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gQXBwKHsgQ29tcG9uZW50LCBwYWdlUHJvcHMgfTogQXBwUHJvcHMpIHtcbiAgcmV0dXJuIChcbiAgICA8V2FsbGV0UHJvdmlkZXI+XG4gICAgICA8Q29tcG9uZW50IHsuLi5wYWdlUHJvcHN9IC8+XG4gICAgPC9XYWxsZXRQcm92aWRlcj5cbiAgKVxufVxuIl0sIm5hbWVzIjpbIldhbGxldFByb3ZpZGVyIiwiQXBwIiwiQ29tcG9uZW50IiwicGFnZVByb3BzIl0sInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///./pages/_app.tsx\n");

/***/ }),

/***/ "./styles/globals.css":
/*!****************************!*\
  !*** ./styles/globals.css ***!
  \****************************/
/***/ (() => {



/***/ }),

/***/ "@solana/web3.js":
/*!**********************************!*\
  !*** external "@solana/web3.js" ***!
  \**********************************/
/***/ ((module) => {

"use strict";
module.exports = require("@solana/web3.js");

/***/ }),

/***/ "react":
/*!************************!*\
  !*** external "react" ***!
  \************************/
/***/ ((module) => {

"use strict";
module.exports = require("react");

/***/ }),

/***/ "react/jsx-dev-runtime":
/*!****************************************!*\
  !*** external "react/jsx-dev-runtime" ***!
  \****************************************/
/***/ ((module) => {

"use strict";
module.exports = require("react/jsx-dev-runtime");

/***/ }),

/***/ "tweetnacl":
/*!****************************!*\
  !*** external "tweetnacl" ***!
  \****************************/
/***/ ((module) => {

"use strict";
module.exports = require("tweetnacl");

/***/ }),

/***/ "bs58":
/*!***********************!*\
  !*** external "bs58" ***!
  \***********************/
/***/ ((module) => {

"use strict";
module.exports = import("bs58");;

/***/ })

};
;

// load runtime
var __webpack_require__ = require("../webpack-runtime.js");
__webpack_require__.C(exports);
var __webpack_exec__ = (moduleId) => (__webpack_require__(__webpack_require__.s = moduleId))
var __webpack_exports__ = (__webpack_exec__("./pages/_app.tsx"));
module.exports = __webpack_exports__;

})();