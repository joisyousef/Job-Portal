import { React, useState, useRef, useEffect } from "react";
import Quill from "quill";
import { JobCategories, JobLocations } from "../assets/assets";

const AddJob = () => {
  const [title, setTitle] = useState("");
  const [location, setLocation] = useState("Egypt");
  const [category, setCategory] = useState("Proggramming");
  const [level, setLevel] = useState("Beginner");
  const [salary, setSalary] = useState(0);

  const editorRef = useRef(null);
  const quillRef = useRef(null);

  const onSubmitHandler = async (e) => {
    e.preventDefault();
  };
  useEffect(() => {
    // Initialize Quill editor only once
    if (!quillRef.current && editorRef.current) {
      quillRef.current = new Quill(editorRef.current, {
        theme: "snow",
        modules: {
          //   toolbar: [
          //     [{ header: [1, 2, false] }],
          //     ["bold", "italic", "underline"],
          //     ["code-block"],
          //     [{ list: "ordered" }, { list: "bullet" }],
          //     ["link", "image"],
          //   ],
        },
        placeholder: "Job Description",
      });
    }
  }, []);

  return (
    <form className="container p-6 flex flex-col w-full items-start gap-6 bg-white rounded-lg shadow-sm max-w-4xl mx-auto">
      <h2 className="text-2xl font-semibold text-gray-800 mb-2">Add New Job</h2>

      <div className="w-full">
        <label className="block text-gray-700 font-medium mb-2">
          Job Title
        </label>
        <input
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition duration-200"
          type="text"
          placeholder="Enter job title"
          onChange={(e) => setTitle(e.target.value)}
          value={title}
          required
        />
      </div>

      <div className="w-full">
        <label className="block text-gray-700 font-medium mb-2">
          Job Description
        </label>
        <div
          ref={editorRef}
          className="border border-gray-300 rounded-lg min-h-32"
        ></div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
        <div>
          <label className="block text-gray-700 font-medium mb-2">
            Job Category
          </label>
          <select
            className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 appearance-none transition duration-200"
            onChange={(e) => {
              setCategory(e.target.value);
            }}
            style={{
              backgroundImage: `url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e")`,
              backgroundRepeat: "no-repeat",
              backgroundPosition: "right 1rem center",
              backgroundSize: "1em",
            }}
          >
            {JobCategories.map((category, index) => (
              <option key={index} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-gray-700 font-medium mb-2">
            Job Location
          </label>
          <select
            className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 appearance-none transition duration-200"
            onChange={(e) => {
              setLocation(e.target.value);
            }}
            style={{
              backgroundImage: `url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e")`,
              backgroundRepeat: "no-repeat",
              backgroundPosition: "right 1rem center",
              backgroundSize: "1em",
            }}
          >
            {JobLocations.map((location, index) => (
              <option key={index} value={location}>
                {location}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-gray-700 font-medium mb-2">
            Job Level
          </label>
          <select
            className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 appearance-none transition duration-200"
            onChange={(e) => {
              setLevel(e.target.value);
            }}
            style={{
              backgroundImage: `url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e")`,
              backgroundRepeat: "no-repeat",
              backgroundPosition: "right 1rem center",
              backgroundSize: "1em",
            }}
          >
            <option value="Beginner">Beginner</option>
            <option value="Intermediate">Intermediate</option>
            <option value="Senior">Senior</option>
          </select>
        </div>
      </div>

      <div className="w-full md:w-1/3">
        <label className="block text-gray-700 font-medium mb-2">
          Job Salary
        </label>
        <div className="relative">
          <span className="absolute left-3 top-3 text-gray-500">$</span>
          <input
            min="0"
            className="w-full pl-8 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition duration-200"
            onChange={(e) => setSalary(e.target.value)}
            type="Number"
            placeholder="2500"
          />
        </div>
      </div>

      <div className="flex items-center justify-end w-full mt-4">
        <button
          type="submit"
          className="px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition duration-300 cursor-pointer focus:outline-none focus:ring-4 focus:ring-blue-300 shadow-sm"
        >
          Add Job
        </button>
      </div>
    </form>
  );
};
export default AddJob;
