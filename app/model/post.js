module.exports = (app) => {
  const mongoose = app.mongoose;
  const Schema = mongoose.Schema;

  const PostSchema = new Schema({
    id: { type: mongoose.ObjectId },
    name: { type: String },
    url: { type: String },
    raw: { type: String },
    tags: { type: Array },
    category: { type: Array },
    readTotalCount: { type: Number },
    publishTime: { type: Date },
    createTime: { type: Date, default: Date.now },
    updateTime: { type: Date },
  });

  return mongoose.model('Post', PostSchema);
};
