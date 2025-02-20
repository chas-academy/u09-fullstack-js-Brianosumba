import React, { useState, useEffect } from "react";

const EditRecommendationModal = ({
  isOpen,
  onClose,
  onSave,
  exercises,
  currentExerciseId,
  recommendationId,
  currentNotes,
}) => {
  const [selectedExercise, setSelectedExercise] = useState("");
  const [notes, setNotes] = useState("");

  useEffect(() => {
    setSelectedExercise(currentExerciseId || "");
    setNotes(currentNotes || "");
  }, [currentExerciseId, currentNotes]);

  if (!isOpen) return null;

  const handleSave = () => {
    if (!recommendationId || !selectedExercise) {
      console.error("Recommendation ID is missing. Cannot save changes.");
      alert("Error: Recommendation ID is missing");
      return;
    }

    const updatedFields = {
      exerciseId: selectedExercise,
      notes,
    };

    console.log(
      "Saving recommendation with ID:",
      recommendationId,
      updatedFields
    ); // Debug log
    onSave(recommendationId, updatedFields);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50">
      <div className="bg-white p-8 rounded-lg w-96 shadow-lg transform transition-transform scale-100">
        <h2 className="text-2xl font-bold mb-6 text-gray-800 border-b pb-4">
          Edit Recommendation
        </h2>
        <label className="block mb-2 text-sm font-medium text-gray-700">
          Select Exercise
        </label>
        <select
          value={selectedExercise}
          onChange={(e) => setSelectedExercise(e.target.value)}
          className="w-full border border-gray-300 px-4 py-2 rounded-md mb-6 bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          {exercises.map((exercise) => (
            <option
              key={exercise.id}
              value={exercise.id}
              className="text-gray-700 bg-white"
            >
              {exercise.name}
            </option>
          ))}
        </select>
        <label className="block mb-2 text-sm font-medium text-gray-700">
          Notes
        </label>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          className="w-full border border-gray-300 px-4 py-2 rounded-md mb-6 resize-none h-24 bg-white text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="Add your notes here..."
        />
        <div className="flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 text-sm font-medium bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditRecommendationModal;
