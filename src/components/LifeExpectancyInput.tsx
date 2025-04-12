
import { useEffect } from "react";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import { useLanguage } from "@/hooks/useLanguage";
import { useTimeCanvas } from "@/hooks/useTimeCanvas";

export function LifeExpectancyInput() {
  const { t } = useLanguage();
  const { lifeExpectancy, setLifeExpectancy } = useTimeCanvas();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    if (!isNaN(value) && value >= 1 && value <= 120) {
      setLifeExpectancy(value);
    }
  };

  const handleSliderChange = (value: number[]) => {
    setLifeExpectancy(value[0]);
  };

  return (
    <div className="flex flex-col gap-2">
      <label className="text-sm font-medium">{t("lifeExpectancy")}</label>
      <div className="flex items-center gap-4">
        <Slider
          defaultValue={[lifeExpectancy]}
          min={30}
          max={120}
          step={1}
          value={[lifeExpectancy]}
          onValueChange={handleSliderChange}
          className="flex-1"
        />
        <Input
          type="number"
          value={lifeExpectancy}
          onChange={handleInputChange}
          min={1}
          max={120}
          className="w-20"
        />
      </div>
    </div>
  );
}

export default LifeExpectancyInput;
