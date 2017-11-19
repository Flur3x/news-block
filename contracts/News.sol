pragma solidity ^0.4.2;

contract News {
	string private latest;

	function News() private {
		latest = "Hurra! Die News werden angezeigt.";
	}

	function getLatest() public returns (string) {
		return latest;
	}

	function setLatest(string news) public {
		latest = news;
	}
}
