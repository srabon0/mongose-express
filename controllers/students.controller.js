const { ObjectId } = require("mongodb");
const { getDb } = require("../utils/dbConnect");


module.exports.getAllStudents = async (req, res, next) => {
  try {
    const { limit, page } = req.query;
    const db = getDb();

    // cursor => toArray(), forEach()
    const student = await db
      .collection("students")
      .find({})
      // .project({ _id: 0 })
      .skip(+page * limit)
      .limit(+limit) // + sign converts the string to integer
      .toArray();

    res.status(200).json({ success: true, data: student });
  } catch (error) {
    next(error);
  }
};

module.exports.saveAStudent= async (req, res, next) => {
  try {
    const db = getDb();
    const student = req.body;
    console.log(student);

    const result = await db.collection("students").insertOne(student);
    console.log(result);

    if (!result.insertedId) {
      return res.status(400).send({ status: false, error: "Something went wrong!" });
    }

    res.send({ success: true, message: `student added with id: ${result.insertedId}` });
  } catch (error) {
    next(error);
  }
};

module.exports.getStudentDetail = async (req, res, next) => {
  try {
    const db = getDb();
    const { id } = req.params;

    if(!ObjectId.isValid(id)){
      return res.status(400).json({ success: false, error: "Not a valid student id."});
    }

    const student = await db.collection("student_info").findOne({_id: ObjectId(id)});

    if(!student){
      return res.status(400).json({ success: false, error: "Couldn't find a student with this id"});
    }

    res.status(200).json({ success: true, data: student });
    
  } catch (error) {
    next(error);
  }
};

module.exports.updateStudent = async (req, res, next) => {
  try {
    const db = getDb();
    const { id } = req.params;

    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, error: "Not a valid student id." });
    }

    const student = await db.collection("students").updateOne({ _id: ObjectId(id) }, { $set: req.body });

    if (!student.modifiedCount) {
      return res.status(400).json({ success: false, error: "Couldn't update the student" });
    }

    res.status(200).json({ success: true, message: "Successfully updated the student" });
  } catch (error) {
    next(error);
  }
};

module.exports.deleteStudent = async (req, res, next) => {
  try {
    const db = getDb();
    const { id } = req.params;

    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, error: "Not a valid student id." });
    }

    const student = await db.collection("students").deleteOne({ _id: ObjectId(id) });

    if (!student.deletedCount) {
      return res.status(400).json({ success: false, error: "Couldn't delete the student" });
    }

    res.status(200).json({ success: true, message: "Successfully deleted the student" });
  } catch (error) {
    next(error);
  }
};

module.exports.test = async(req, res, next) => {
  for (let i = 0; i < 10; i++) {
    const db = getDb();
    const rsu = await db.collection("test").insertOne({name: `test ${i}`, age: i });
    res.json(rsu);

  }
};
module.exports.testGet = async(req, res, next) => {
  const db = getDb();

  const result = await db.collection("test").find({}).toArray();
  res.json(result);
};