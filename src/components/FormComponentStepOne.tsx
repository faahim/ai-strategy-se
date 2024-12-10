import { useState } from "react";
import aiTools from "../../public/ai-tools.json";
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
      window.location.href = "/suggestions";
    }
  };

  const renderTools = () => {
    return categorizedTools[selectedCategory]?.map((tool, index) => (
      <div
        key={index}
        className="p-4 border-2 border-blue-200 rounded-lg hover:border-blue-500 cursor-pointer"
      >
        <div className="flex items-center gap-4 mb-2">
          {tool.icon && (
            <img
              src={tool.icon}
              alt={`${tool.name} icon`}
              className="w-8 h-8"
            />
          )}
          <h3 className="text-xl font-bold">{tool.name}</h3>
        </div>
        <p className="text-gray-600 mb-3">{tool.description}</p>
        <div className="flex flex-wrap gap-2 mb-4">
          {tool.tags.map((tag, tagIndex) => (
            <span
              key={tagIndex}
              className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
            >
              {tag}
            </span>
          ))}
        </div>
        <a
          href={tool.url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors"
        >
          Visit Tool
        </a>
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
