import React from 'react';

/**
 * About Page
 * Information about the application
 */
const About = () => {
  return (
    <div className="about-page">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">
            About Transaction Data Validator
          </h1>

          <div className="bg-white rounded-lg shadow p-8 mb-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              What is this tool?
            </h2>
            <p className="text-gray-600 leading-relaxed">
              The Transaction Data Validator is a powerful web-based platform designed to 
              validate, clean, and process transaction datasets. It was built as part of 
              the Xeno Implementation Internship Drive 2026 assignment.
            </p>
          </div>

          <div className="bg-white rounded-lg shadow p-8 mb-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              Key Features
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-blue-50 rounded-lg">
                <h3 className="font-medium text-blue-800 mb-2">📊 CSV Validation</h3>
                <p className="text-sm text-gray-600">
                  Validate CSV files for transaction data with comprehensive checks
                </p>
              </div>
              <div className="p-4 bg-green-50 rounded-lg">
                <h3 className="font-medium text-green-800 mb-2">🌍 Multi-Country Support</h3>
                <p className="text-sm text-gray-600">
                  Support for multiple countries with configurable validation rules
                </p>
              </div>
              <div className="p-4 bg-purple-50 rounded-lg">
                <h3 className="font-medium text-purple-800 mb-2">📁 File Chunking</h3>
                <p className="text-sm text-gray-600">
                  Automatically split large CSV files into manageable chunks
                </p>
              </div>
              <div className="p-4 bg-yellow-50 rounded-lg">
                <h3 className="font-medium text-yellow-800 mb-2">📈 Reports</h3>
                <p className="text-sm text-gray-600">
                  Generate detailed validation reports and error summaries
                </p>
              </div>
              <div className="p-4 bg-red-50 rounded-lg">
                <h3 className="font-medium text-red-800 mb-2">📥 Downloads</h3>
                <p className="text-sm text-gray-600">
                  Download cleaned data, error reports, and chunked files
                </p>
              </div>
              <div className="p-4 bg-indigo-50 rounded-lg">
                <h3 className="font-medium text-indigo-800 mb-2">🔍 Error Tracking</h3>
                <p className="text-sm text-gray-600">
                  Detailed error tracking with row-level validation results
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-8 mb-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              Technologies Used
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-3xl mb-2">⚛️</div>
                <div className="font-medium text-gray-700">React</div>
                <div className="text-sm text-gray-500">Frontend Framework</div>
              </div>
              <div className="text-center">
                <div className="text-3xl mb-2">🚀</div>
                <div className="font-medium text-gray-700">Node.js</div>
                <div className="text-sm text-gray-500">Backend Runtime</div>
              </div>
              <div className="text-center">
                <div className="text-3xl mb-2">⚡</div>
                <div className="font-medium text-gray-700">Express</div>
                <div className="text-sm text-gray-500">Web Framework</div>
              </div>
              <div className="text-center">
                <div className="text-3xl mb-2">🐘</div>
                <div className="font-medium text-gray-700">MySQL</div>
                <div className="text-sm text-gray-500">Database</div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-8 mb-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              How It Works
            </h2>
            <ol className="list-decimal list-inside space-y-3 text-gray-600">
              <li>
                <span className="font-medium">Upload:</span> Select a CSV file containing transaction data
              </li>
              <li>
                <span className="font-medium">Validate:</span> The system validates phone numbers, dates, amounts, and other fields based on country-specific rules
              </li>
              <li>
                <span className="font-medium">Process:</span> Valid data is cleaned and saved, invalid data is logged with error details
              </li>
              <li>
                <span className="font-medium">Download:</span> Download cleaned data, error reports, or chunked files for further processing
              </li>
            </ol>
          </div>

          <div className="bg-white rounded-lg shadow p-8">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              Assignment Context
            </h2>
            <p className="text-gray-600 leading-relaxed">
              This project was developed as part of the <strong>Xeno Implementation Internship Drive 2026 </strong> 
              assignment. It demonstrates skills in full-stack development, data validation, CSV processing, 
              and building scalable web applications.
            </p>
            <div className="mt-4 p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600">
                <span className="font-medium">🔗 Xeno:</span> An AI-native company focused on customer engagement and data-driven solutions.
              </p>
            </div>
          </div>

          {/* Footer note */}
          <div className="mt-8 text-center text-sm text-gray-400">
            Built with ❤️ for the Xeno Internship Assignment 2026
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;