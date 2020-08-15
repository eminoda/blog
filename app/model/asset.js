module.exports = (app) => {
  const mongoose = app.mongoose;
  mongoose.set('debug', true);

  const Schema = mongoose.Schema;

  const AssetSchema = new Schema({
    id: { type: mongoose.ObjectId },
    postId: { type: mongoose.ObjectId },
    fileName: { type: String },
    desc: { type: String },
    originUrl: { type: String },
    downStatus: { type: Number, default: 0 },
    publishTime: { type: Date },
    createTime: { type: Date, default: Date.now },
    updateTime: { type: Date },
  });

  return mongoose.model('Asset', AssetSchema);
};
