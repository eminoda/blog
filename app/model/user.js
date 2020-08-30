module.exports = (app) => {
  const mongoose = app.mongoose;
  mongoose.set('debug', true);

  const Schema = mongoose.Schema;

  const UserSchema = new Schema({
    id: { type: mongoose.ObjectId },
    userName: { type: String },
    password: { type: String },
    level: { type: Number, default: 1 }, //1：普通用户
    createTime: { type: Date, default: Date.now },
    updateTime: { type: Date },
  });

  return mongoose.model('User', UserSchema);
};
