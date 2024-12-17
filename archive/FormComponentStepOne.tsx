import { useState } from "react";
import aiTools from "../assets/data/ai-tools.json";
import type { TTool } from "../types";

const FormComponentStepOne = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState("");

  const categorizedTools = (aiTools as TTool[]).reduce(
    (acc: { [key: string]: TTool[] }, tool) => {
      // Convert tags to lowercase for consistent matching
      tool.tags.forEach((tag) => {
        const lowerTag = tag.toLowerCase();
        // Check if tag matches our categories
        if (
          (lowerTag.includes("writing") && selectedCategory === "text") ||
          (lowerTag.includes("coding") && selectedCategory === "coding") ||
          (lowerTag.includes("image") && selectedCategory === "image")
        ) {
          if (!acc[selectedCategory]) {
            acc[selectedCategory] = [];
          }
          if (!acc[selectedCategory].find((t) => t.name === tool.name)) {
            acc[selectedCategory].push(tool);
          }
        }
      });
      return acc;
    },
    {}
  );

  const categories = ["text", "coding", "image"];

  const handleCategorySelect = (category: string) => {
    setSelectedCategory(category);
  };

  const handleNext = () => {
    if (currentStep === 1 && selectedCategory) {
      setCurrentStep(2);
    } else if (currentStep === 2) {
      console.log("Form completed!");
      window.location.href = "/filter";
    }
  };

  const renderTools = () => {
    return categorizedTools[selectedCategory]?.map((tool, index) => (
      <div
        key={index}
        className="p-5 bg-white rounded-lg border border-gray-200 hover:border-indigo-500 hover:bg-[#FBFAFF] hover:shadow-md hover:shadow-indigo-500/10 hover:outline hover:outline-indigo-200 cursor-pointer group"
      >
        <div className="flex items-center gap-3 mb-3">
          {/*  {tool.logo_url && (
                  <img
                    src={tool.logo_url}
                    alt={`${tool.name} icon`}
                    class="w-8 h-8"
                  />
                )} */}
          <h2 className="text-[15px] font-medium text-gray-900">{tool.name}</h2>
        </div>
        <p className="text-[13px] text-gray-600 mb-6 line-clamp-2 leading-relaxed">
          {tool.description}
        </p>
        <button className="py-[6px] px-4 rounded-md border border-gray-200 text-[13px] font-medium text-gray-700 hover:bg-gray-50 transition-colors flex items-center justify-center gap-2 group-hover:bg-white group-hover:border-gray-300 shadow-md">
          <span className="material-icons text-[18px]">link</span>
          Connect
        </button>
      </div>
    ));
  };

  return (
    <div className="flex flex-col items-center gap-8 p-6">
      {currentStep === 1 && (
        <div className="flex flex-col items-center gap-8">
          <h2 className="text-2xl font-bold">Step 1: Choose Category</h2>
          <div className="flex gap-4">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => handleCategorySelect(category)}
                className={`px-6 py-3 text-lg font-semibold rounded-lg border-2 border-blue-500 transition-colors duration-300 
                  ${
                    selectedCategory === category
                      ? "bg-blue-500 text-white"
                      : "hover:bg-blue-500 hover:text-white"
                  }`}
              >
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </button>
            ))}
          </div>
        </div>
      )}

      {currentStep === 2 && (
        <div className="flex flex-col items-center gap-8 w-full max-w-6xl">
          <h2 className="text-2xl font-bold">Step 2: Select Tools</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 w-full">
            {renderTools()}
          </div>
        </div>
      )}

      <button
        onClick={handleNext}
        disabled={!selectedCategory}
        className="px-8 py-3 text-lg font-bold rounded-lg border-2 border-green-500 hover:bg-green-500 hover:text-white transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {currentStep === 1 ? "Next" : "Finish"}
      </button>
    </div>
  );
};

export default FormComponentStepOne;
