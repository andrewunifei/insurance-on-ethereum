// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract FunctionsClient {

    struct RequestParams {
        uint64  subscriptionId;
        bytes   data;
        uint16  DATA_VERSION;
        uint32  callbackGasLimit;
        bytes32 donId;
    }

    event RequestSent(bytes32 indexed id);

    uint16 public constant REQUEST_DATA_VERSION = 1;
    bytes32 public requestId;
    uint256 private nonce = 0;
    mapping (bytes32 => RequestParams[]) public requests;

    function _sendRequest(
        bytes memory data,
        uint64 subscriptionId,
        uint32 callbackGasLimit,
        bytes32 donId
    ) internal returns (bytes32) {
        RequestParams memory incomingData = RequestParams({
            subscriptionId: subscriptionId,
            data: data,
            DATA_VERSION: REQUEST_DATA_VERSION,
            callbackGasLimit: callbackGasLimit,
            donId: donId
        });
        requestId = bytes32(nonce);
        nonce += 1;
        requests[requestId].push(incomingData);

        emit RequestSent(requestId);
        return requestId;

        // Original behavior from FunctionsClient.sol
        // bytes32 requestId = i_router.sendRequest(
        //     subscriptionId,
        //     data,
        //     REQUEST_DATA_VERSION,
        //     callbackGasLimit,
        //     donId
        // );
    }
}