// SPDX-License-Identifier: agpl-3.0
pragma solidity ^0.8.0;

interface IPermissionedPayloadsController {
  /**
   * @notice Object containing the information necessary to define a payload action
   * @param target address of the contract that needs to be executed
   * @param withDelegateCall boolean indicating if execution needs to be delegated
   * @param accessLevel access level of the executor needed for the execution
   * @param value value amount that needs to be sent to the executeTransaction method
   * @param signature method signature that will be executed
   * @param callData data needed for the execution of the signature
   */
  struct ExecutionAction {
    address target;
    bool withDelegateCall;
    PayloadsControllerUtils.AccessControl accessLevel;
    uint256 value;
    string signature;
    bytes callData;
  }

  /**
   * @notice holds configuration of the executor
   * @param executor address of the executor
   * @param delay time in seconds between queuing and execution
   */
  struct ExecutorConfig {
    address executor;
    uint40 delay;
  }

  /**
   * @notice method that will create a Payload object for every action sent
   * @param actions array of actions which this proposal payload will contain
   * @return id of the created payload
   */
  function createPayload(ExecutionAction[] calldata actions) external returns (uint40);

  /**
   * @notice method to get the executor configuration assigned to the specified level
   * @param accessControl level of which we want to get the executor configuration from
   * @return executor configuration
   */
  function getExecutorSettingsByAccessControl(
    PayloadsControllerUtils.AccessControl accessControl
  ) external view returns (ExecutorConfig memory);

  /**
   * @notice method to get payload manager address;
   */
  function payloadsManager() external view returns (address);
}

library PayloadsControllerUtils {
  /// @notice enum with supported access levels
  enum AccessControl {
    Level_null, // to not use 0
    Level_1, // LEVEL_1 - short executor before, listing assets, changes of assets params, updates of the protocol etc
    Level_2 // LEVEL_2 - long executor before, payloads controller updates
  }

  /**
   * @notice Object containing the necessary payload information.
   * @param chain
   * @param accessLevel
   * @param payloadsController
   * @param payloadId
   */
  struct Payload {
    uint256 chain;
    AccessControl accessLevel;
    address payloadsController; // address which holds the logic to execute after success proposal voting
    uint40 payloadId; // number of the payload placed to payloadsController, max is: ~10¹²
  }
}
