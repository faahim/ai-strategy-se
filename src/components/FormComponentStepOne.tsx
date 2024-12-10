import { useState } from "react";

interface Tool {
  name: string;
  description: string;
  tags: string[];
}

interface ToolsData {
  [key: string]: Tool[];
}

const FormComponentStepOne = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState("");

  const toolsData: ToolsData = {
    text: [
      {
        name: "ChatGPT",
        description:
          "Advanced language model for conversation, writing, and problem-solving",
        tags: ["Chatbot", "Writing", "AI Assistant"],
      },
      {
        name: "Claude",
        description: "Anthropic's AI assistant for writing and analysis",
        tags: ["Writing", "Analysis", "AI Assistant"],
      },
    ],
    coding: [
      {
        name: "GitHub Copilot",
        description: "AI-powered code completion and suggestion tool",
        tags: ["Coding", "Development", "AI Assistant"],
      },
      {
        name: "Amazon CodeWhisperer",
        description: "AI code companion for developers",
        tags: ["Coding", "AWS", "AI Assistant"],
      },
    ],
    image: [
      {
        name: "DALL-E",
        description: "AI system that creates images from text descriptions",
        tags: ["Image Generation", "AI Art", "Creative"],
      },
      {
        name: "Midjourney",
        description: "AI art generator with stunning visual capabilities",
        tags: ["AI Art", "Creative", "Visual Design"],
      },
    ],
  };

  const handleCategorySelect = (category: string) => {
    setSelectedCategory(category);
  };

  const handleNext = () => {
    if (currentStep === 1 && selectedCategory) {
      setCurrentStep(2);
    } else if (currentStep === 2) {
      console.log("Form completed!");
    }
  };

  const renderTools = () => {
    return toolsData[selectedCategory]?.map((tool, index) => (
      <div
        key={index}
        className="p-4 border-2 border-blue-200 rounded-lg hover:border-blue-500 cursor-pointer"
      >
        <h3 className="text-xl font-bold mb-2">{tool.name}</h3>
        <p className="text-gray-600 mb-3">{tool.description}</p>
        <div className="flex flex-wrap gap-2">
          {tool.tags.map((tag, tagIndex) => (
            <span
              key={tagIndex}
              className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    ));
  };

  return (
    <div className="flex flex-col items-center gap-8 p-6">
      {currentStep === 1 && (
        <div className="flex flex-col items-center gap-8">
          <h2 className="text-2xl font-bold">Step 1: Choose Category</h2>
          <div className="flex gap-4">
            {["text", "coding", "image"].map((category) => (
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
        <div className="flex flex-col items-center gap-8">
          <h2 className="text-2xl font-bold">Step 2: Select Tools</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
