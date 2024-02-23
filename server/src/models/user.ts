import { Schema, model } from 'mongoose';
import { UserDocument } from '../types/user.interface';
import validator from 'validator';
import bcryptjs from 'bcryptjs';

const userSchema = new Schema<UserDocument>(
  {
    email: {
      type: String,
      required: [true, 'Email is required'],
      validate: [validator.isEmail, 'invalid email'],
      createIndexes: { unique: true },
    },
    username: {
      type: String,
      required: [true, 'Usename is required'],
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      select: false, //this will disable nodejs server to send this field back
    },
  },
  {
    timestamps: true,
  }
);

/* this pre will run before save for example in controller we can have like this
  const user = new User({email:''.username:"",password:''});
  user.save();
  user.validatePassword("already stored password");
 */

userSchema.pre('save', async function (next) {
  //for hashing password after creation and updation
  if (!this.isModified('password')) {
    // if password is not modified then simply go ahead
    return next();
  }

  try {
    const salt = await bcryptjs.genSalt(10);
    this.password = await bcryptjs.hash(this.password, salt);
    return next();
  } catch (err) {
    return next(err as Error);
  }
});

userSchema.methods['validatePassword'] = function (password: string) {
  //this is to validate password on user login
  //   console.log('validatePassword', password, this);
  return bcryptjs.compare(password, this['password']);
};

export default model<UserDocument>('User', userSchema);
