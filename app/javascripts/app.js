import '../stylesheets/app.css';

import { default as Web3 } from 'web3';
import { default as contract } from 'truffle-contract';

import news_artifacts from '../../build/contracts/News.json';

var News = contract(news_artifacts);

var accounts;
var account;

window.App = {
    start: function () {
        News.setProvider(web3.currentProvider);

        web3.eth.getAccounts(function(err, accs) {
            if (err != null) {
                alert("There was an error fetching your accounts.");
                return;
            }

            if (accs.length == 0) {
                alert("Couldn't get any accounts! Make sure your Ethereum client is configured correctly.");
                return;
            }

            accounts = accs;
            account = accounts[0];

            console.log('account: ', account);
            console.log('web3.eth.coinbase: ', web3.eth.coinbase);

            App.getLatestNews();
        });
    },

    getLatestNews: function () {
        var self = this;
        var news;

        News.deployed().then(function (instance) {
            news = instance;
            return news.getLatest.call();
        }).then(function (news) {
            var latest_news_element = document.getElementById('latest-news');

            latest_news_element.innerHTML = news;
        }).catch(function (e) {
            console.log(e);
        });
    },

    submit: function () {
        var value = document.getElementById('submit-news').value;
        var self = this;
        var news;

        console.log('value', value);

        News.deployed().then(function (instance) {
            news = instance;
            return news.setLatest(value, { from: web3.eth.coinbase });
        }).then(function(result) {
            alert("Transaction successful!")
        }).catch(function (e) {
            console.log(e);
        });
    },
};

window.addEventListener('load', function () {
    // Checking if Web3 has been injected by the browser (Mist/MetaMask)
    if (typeof web3 !== 'undefined') {
        console.warn('Using web3 detected from external source. If you find that your accounts don\'t appear or you have 0 MetaCoin, ensure you\'ve configured that source properly. If using MetaMask, see the following link. Feel free to delete this warning. :) http://truffleframework.com/tutorials/truffle-and-metamask')
        // Use Mist/MetaMask's provider
        window.web3 = new Web3(web3.currentProvider);
    } else {
        console.warn('No web3 detected. Falling back to http://127.0.0.1:9545. You should remove this fallback when you deploy live, as it\'s inherently insecure. Consider switching to Metamask for development. More info here: http://truffleframework.com/tutorials/truffle-and-metamask');
        // fallback - use your fallback strategy (local node / hosted node + in-dapp id mgmt / fail)
        window.web3 = new Web3(new Web3.providers.HttpProvider('http://127.0.0.1:9545'));
    }

    App.start();
});
