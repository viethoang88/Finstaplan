import PortfolioAssetAllocations from "./portfolio-asset-allocations";
import PortfolioCharacteristics from "./portfolio-characteristics";

const RiskProfileFirmInfo = () => {
  return (
    <div>
      <PortfolioCharacteristics />
      <PortfolioAssetAllocations />
    </div>
  );
};

export default RiskProfileFirmInfo;
