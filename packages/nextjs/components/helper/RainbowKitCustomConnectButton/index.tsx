"use client";

// @refresh reset
import { Balance } from "../Balance";
import { AddressInfoDropdown } from "./AddressInfoDropdown";
import { WrongNetworkDropdown } from "./WrongNetworkDropdown";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { Address } from "viem";
import { useTargetNetwork } from "~~/hooks/helper/useTargetNetwork";
import { getBlockExplorerAddressLink } from "~~/utils/helper";

/**
 * Custom Wagmi Connect Button (watch balance + custom design)
 */
export const RainbowKitCustomConnectButton = () => {
  const { targetNetwork } = useTargetNetwork();

  return (
    <ConnectButton.Custom>
      {({ account, chain, openConnectModal, mounted }) => {
        const connected = mounted && account && chain;
        const blockExplorerAddressLink = account
          ? getBlockExplorerAddressLink(targetNetwork, account.address)
          : undefined;

        return (
          <>
            {(() => {
              if (!connected) {
                return (
                  <button
                    className="
                      px-6 py-3 text-base font-bold text-gray-900 
                      bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-400
                      hover:from-yellow-300 hover:via-yellow-400 hover:to-yellow-300
                      rounded-xl shadow-lg hover:shadow-xl
                      transition-all duration-300
                      transform hover:scale-105
                      border-2 border-yellow-300
                      cursor-pointer
                      animate-pulse
                      hover:animate-none
                      relative overflow-hidden
                    "
                    onClick={openConnectModal}
                    type="button"
                  >
                    <span className="relative z-10 flex items-center gap-2">
                      <span className="text-xl">🔗</span>
                      <span>Connect Wallet</span>
                    </span>
                    <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full hover:translate-x-full transition-transform duration-1000"></span>
                  </button>
                );
              }

              if (chain.unsupported || chain.id !== targetNetwork.id) {
                return <WrongNetworkDropdown />;
              }

              return (
                <>
                  <div className="flex flex-col items-center mr-1 bg-white/10 backdrop-blur-sm rounded-lg px-3 py-2 border border-white/20">
                    <Balance address={account.address as Address} className="min-h-0 h-auto text-white" />
                    <span className="text-xs text-gray-200 font-medium">{chain.name}</span>
                  </div>
                  <AddressInfoDropdown
                    address={account.address as Address}
                    displayName={account.displayName}
                    ensAvatar={account.ensAvatar}
                    blockExplorerAddressLink={blockExplorerAddressLink}
                  />
                </>
              );
            })()}
          </>
        );
      }}
    </ConnectButton.Custom>
  );
};
