import { Text } from "@chakra-ui/layout";
import { Menu, MenuButton, MenuItem, MenuList } from "@chakra-ui/menu";
import { sendMessage } from "src/services/extension";
import { NODE, SUPPORTED_CHAINS } from "../../config/constants/chain";
import { ChainId } from "../../config/types";
import { useQuery } from "../../hooks/useQuery";
import { useAppDispatch, useAppSelector } from "../../hooks/useStore";
import { globalSelector, setChainId } from "../../store/global";
import { ChainIcon } from "../icons";

const SelectChain = ({ render }: { render: (chainId?: ChainId) => JSX.Element }) => {
  const { setQuery } = useQuery();

  const dispatch = useAppDispatch();
  const { chainId } = useAppSelector(globalSelector);

  return (
    <Menu key="1">
      <MenuButton>{render(chainId)}</MenuButton>
      <MenuList bgColor="gray.600" width="18">
        {SUPPORTED_CHAINS.map((targetChainId: ChainId) => {
          return (
            <MenuItem
              icon={<ChainIcon chainId={targetChainId} boxSize={6} />}
              justifyContent="flex-start"
              key={targetChainId.toString()}
              disabled={chainId === targetChainId}
              onClick={() => {
                setQuery(`chainId=${targetChainId}`);
                if (chainId === targetChainId) return;
                dispatch(setChainId(targetChainId));
                sendMessage({ type: "set_chain_id", chainId: targetChainId });
              }}
            >
              <Text fontSize="sm" marginRight="2">
                {NODE[targetChainId].name}
              </Text>
            </MenuItem>
          );
        })}
      </MenuList>
    </Menu>
  );
};

export default SelectChain;
