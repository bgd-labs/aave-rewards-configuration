import {generateContractName, getPoolChain, getChainAlias} from '../common';
import {Options, PoolConfig, PoolIdentifier} from '../types';
import {prefixWithImports} from '../utils/importsResolver';
import {prefixWithPragma} from '../utils/constants';

export const liquidityMiningUpdateTemplate = (
  options: Options,
  poolConfig: PoolConfig,
  pool: PoolIdentifier
) => {
  const chain = getPoolChain(pool);
  const contractName = generateContractName(options, pool);

  const constants = poolConfig.artifacts
    .map((artifact) => artifact.code?.constants)
    .flat()
    .filter((f) => f !== undefined)
    .join('\n');
  const functions = poolConfig.artifacts
    .map((artifact) => artifact.code?.fn)
    .flat()
    .filter((f) => f !== undefined)
    .join('\n');

  const contract = `contract ${contractName} is LMUpdateBaseTest {
   ${constants}
    
   address public override EMISSION_ADMIN;
   IPermissionedPayloadsController internal permissionedPayloadsController;

   function setUp() public {
     vm.createSelectFork(vm.rpcUrl('${getChainAlias(chain)}'), ${poolConfig.cache.blockNumber});
     Executor executor = new Executor();

     permissionedPayloadsController = new PermissionedPayloadsController();

     IPayloadsControllerCore.UpdateExecutorInput[]
       memory executorInput = new IPayloadsControllerCore.UpdateExecutorInput[](1);
     executorInput[0].accessLevel = PayloadsControllerUtils.AccessControl.Level_1;
     executorInput[0].executorConfig.executor = address(executor);
     executorInput[0].executorConfig.delay = 1 days;

     TransparentProxyFactory proxyFactory = new TransparentProxyFactory();
     permissionedPayloadsController = IPermissionedPayloadsController(
       proxyFactory.create(
         address(permissionedPayloadsController),
         address(728),
         abi.encodeWithSelector(
           IPermissionedPayloadsController.initialize.selector,
           address(415),
           address(490),
           address(659),
           executorInput
         )
       )
     );

     address emissionManagerOwner = IOwnable(${pool}.EMISSION_MANAGER).owner();
     vm.prank(emissionManagerOwner);
     IEmissionManager(${pool}.EMISSION_MANAGER).setEmissionAdmin(
       REWARD_ASSET,
       address(executor)
     );
     EMISSION_ADMIN = address(executor);

     IOwnable(address(executor)).transferOwnership(address(permissionedPayloadsController));
   }

   ${functions}
   }`;

  return prefixWithPragma(prefixWithImports(contract));
};
