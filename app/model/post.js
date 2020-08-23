module.exports = (app) => {
  const mongoose = app.mongoose;
  mongoose.set('debug', true);

  const Schema = mongoose.Schema;

  const PostSchema = new Schema({
    id: { type: mongoose.ObjectId },
    fileName: { type: String },
    title: { type: String },
    url: { type: String },
    raw: { type: String },
    tags: { type: Array },
    categories: { type: Array },
    readTotalCount: { type: Number },
    originMarkdown: { type: String },
    markdown: { type: String },
    publishTime: { type: Date },
    createTime: { type: Date, default: Date.now },
    updateTime: { type: Date },
  });

  return mongoose.model('Post', PostSchema);
};
