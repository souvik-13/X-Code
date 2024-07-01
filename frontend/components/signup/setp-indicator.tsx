import { cn } from "@/lib/utils";

const StepIndicator = ({ currentStep }: { currentStep: number }) => {
  return (
    <div className="flex w-full items-center justify-center pt-4">
      <div className="flex w-[60%] items-center">
        <div
          style={{ borderRadius: "50%" }}
          className={cn(
            "grid size-10 flex-shrink-0 cursor-default place-items-center bg-primary",
          )}
        >
          1
        </div>
        <div
          className={cn("h-2 w-1/2 bg-accent", {
            "bg-primary": currentStep === 2 || currentStep === 3,
          })}
        />
        <div
          style={{ borderRadius: "50%" }}
          className={cn(
            "grid size-10 flex-shrink-0 cursor-default place-items-center bg-accent",
            {
              "bg-primary": currentStep === 2 || currentStep === 3,
            },
          )}
        >
          2
        </div>
        <div
          className={cn("h-2 w-1/2 bg-accent", {
            "bg-primary": currentStep === 3,
          })}
        />
        <div
          style={{ borderRadius: "50%" }}
          className={cn(
            "grid size-10 flex-shrink-0 cursor-default place-items-center bg-accent",
            {
              "bg-primary": currentStep === 3,
            },
          )}
        >
          3
        </div>
      </div>
    </div>
  );
};

export default StepIndicator;
