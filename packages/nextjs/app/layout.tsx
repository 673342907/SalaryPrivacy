import "@rainbow-me/rainbowkit/styles.css";
import { DappWrapperWithProviders } from "~~/components/DappWrapperWithProviders";
import { ThemeProvider } from "~~/components/ThemeProvider";
import { LocaleProvider } from "~~/contexts/LocaleContext";
import { FHEVMLoader } from "./confidential-salary/_components/FHEVMLoader";
import "~~/styles/globals.css";
import { getMetadata } from "~~/utils/helper/getMetadata";

export const metadata = getMetadata({
  title: "Zama Template",
  description: "Built with FHEVM",
});

const DappWrapper = ({ children }: { children: React.ReactNode }) => {
  return (
    <html suppressHydrationWarning className={``}>
      <head>
        <link
          href="https://api.fontshare.com/v2/css?f[]=telegraf@400,500,700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <FHEVMLoader />
        <LocaleProvider>
          <ThemeProvider enableSystem>
            <DappWrapperWithProviders>{children}</DappWrapperWithProviders>
          </ThemeProvider>
        </LocaleProvider>
      </body>
    </html>
  );
};

export default DappWrapper;
