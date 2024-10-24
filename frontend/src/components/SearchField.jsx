import PropTypes from "prop-types";
function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}
const SearchField = ({ query, setQuery, error, loading }) => {
  return (
    <div className="flex flex-col justify-center items-center mt-6 text-black">
      <div className="flex w-full md:w-1/2">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(`query=${e.target.value}`)}
          placeholder="Search exercises"
          className={classNames(
            `border p-4 rounded-lg w-full`,
            error ? "border-red-500 ring-red-400" : ""
          )}
        />

        <button
          type="submit"
          className="bg-blue-600 text-white p-4 rounded-lg ml-2"
          disabled={loading}
        >
          {loading ? "Loading..." : "Search"}
        </button>
      </div>
      {error && (
        <span className="flex items-center font-medium tracking-wide text-red-500 text-xs mt-1 ml-1">
          {error}
        </span>
      )}
    </div>
  );
};

SearchField.propTypes = {
  setQuery: PropTypes.func.isRequired,
  query: PropTypes.string,
  loading: PropTypes.bool,
  error: PropTypes.bool,
};

export default SearchField;
