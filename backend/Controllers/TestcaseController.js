import File from '../Models/fileModel.js';
import TestCase from '../Models/testCaseModel.js';
import mongoose from "mongoose";

const createTestCase = async (req, res) => {
  try {
    const { fileId } = req.params;
    const { input = '', expected = '', received = '' } = req.body;

    const newTestCaseDoc = new TestCase({ input, expected, received });
    const savedTestCase = await newTestCaseDoc.save();

    const updatedFile = await File.findByIdAndUpdate(
      fileId,
      { $push: { testcase: savedTestCase._id } },
      { new: true }
    );

    if (!updatedFile) {
      await TestCase.findByIdAndDelete(savedTestCase._id);
      return res.status(404).json({ message: 'File not found' });
    }

    res.status(201).json({ message: 'Test case created', testCase: savedTestCase });
  } catch (error) {
    console.error('CreateTestCase error:', error);
    res.status(500).json({ message: error.message });
  }
};

const deleteTestCase = async (req, res) => {
  try {
    const { fileId, testCaseId } = req.params;

    const updatedFile = await File.findByIdAndUpdate(
      fileId,
      { $pull: { testcase: testCaseId } },
      { new: true }
    );

    if (!updatedFile) {
      return res.status(404).json({ message: 'File not found' });
    }

    await TestCase.findByIdAndDelete(testCaseId);

    res.json({ message: 'Test case deleted', file: updatedFile });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateTestCase = async (req, res) => {
  try {
    const { testCaseId } = req.params;
    const updateData = req.body;

    if (!mongoose.Types.ObjectId.isValid(testCaseId)) {
      return res.status(400).json({ message: 'Invalid testCaseId' });
    }

    const updatedTestCase = await TestCase.findByIdAndUpdate(
      testCaseId,
      updateData,
      { new: true, runValidators: true }
    );

    if (!updatedTestCase) {
      return res.status(404).json({ message: 'Test case not found' });
    }
    console.log(updatedTestCase);
    
    res.json({ message: 'Test case updated', testCase: updatedTestCase });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getTestCase = async (req, res) => {
  try {
    const { testCaseId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(testCaseId)) {
      return res.status(400).json({ message: 'Invalid testCaseId' });
    }

    const testCase = await TestCase.findById(testCaseId);

    if (!testCase) {
      return res.status(404).json({ message: 'Test case not found' });
    }

    res.status(200).json({ testCase });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export { createTestCase, deleteTestCase, updateTestCase, getTestCase };
