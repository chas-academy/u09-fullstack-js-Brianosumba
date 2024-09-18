const SearchField = () => {
  return (
    <div className="flex justify-center items-center mt-6">
      <form className="flex w-full md:w-1/2">
        <label htmlFor="exerciseSearch" className="sr-only">
          Search Exercises
        </label>
        <input
          id="exerciseSearch"
          type="text"
          placeholder="Search exercises"
          className="border border-gray-400 p-4 rounded-lg w-full"
        />
        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-500 hover:shadow-lg transition duration-300 text-black font-semibold p-4 rounded-lg ml-2 "
        >
          Search
        </button>
      </form>
    </div>
  );
};

export default SearchField;
