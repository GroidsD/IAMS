import React from "react";
import { FaBook } from "react-icons/fa";

const Manual = () => {
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">User Manual</h1>

      <div className="max-w-lg bg-white shadow-md rounded-2xl p-6 flex flex-col items-center text-center gap-4">
        <FaBook className="w-12 h-12 text-blue-600" />
        <p className="text-gray-700 text-lg">
          Please read the Calibration Management System User Guide for full
          instructions.
        </p>
        <a
          href="https://outlook.office.com/mail/deeplink/attachment/AAkALgAAAAAAHYQDEapmEc2byACqAC-EWg0AxIrSqRSfVketdzGirtOXLgAAHxUhtwAA/AAkALgAAAAAAHYQDEapmEc2byACqAC-EWg0AxIrSqRSfVketdzGirtOXLgAAHxUhtwAAARIAEAAagSDut8mJRIDFqyxEGi4e?AttachmentId=AAkALgAAAAAAHYQDEapmEc2byACqAC-EWg0AxIrSqRSfVketdzGirtOXLgAAHxUhtwAAARIAEAAagSDut8mJRIDFqyxEGi4e&ItemId=AAkALgAAAAAAHYQDEapmEc2byACqAC-EWg0AxIrSqRSfVketdzGirtOXLgAAHxUhtwAA&AttachmentName=Calibration%20Management%20System.pptx"
          target="_blank"
          rel="noopener noreferrer"
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2"
        >
          <FaBook className="w-5 h-5" />
          Open User Guide
        </a>
      </div>
    </div>
  );
};

export default Manual;
