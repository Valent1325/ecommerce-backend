import { Schema, model, Document } from 'mongoose';

import bcrypt from 'bcryptjs';

export interface UserDocument extends Document {
  name: string;
  email: string;
  avatar?: string;
  phone?: string;
  address?: string;
  password?: string;
  matchesPassword: (password: string) => Promise<boolean>;
}

const UserSchema = new Schema(
  {
    name: { type: Schema.Types.String, required: true },
    email: { type: Schema.Types.String, required: true, unique: true, index: true },
    avatar: { type: Schema.Types.String, required: false },
    phone: { type: Schema.Types.String, required: false },
    address: { type: Schema.Types.String, required: false },
    password: Schema.Types.String,
  }, {
    timestamps: true,
    collection: 'users',
    versionKey: false,
  }
);

UserSchema.set('toJSON', {
  virtuals: true,
  transform: function(doc, ret) {
    delete ret._id;
    delete ret.password;
  }
});

// Хэширование пароля
UserSchema.pre<UserDocument>('save', async function() {
  if (this.isModified('password')) {
    if (this.password) {
      const hash = await bcrypt.hashSync(this.password.toString(), 10);
      this.password = hash;
    }
  }
});

// Сравнение паролей
UserSchema.methods.matchesPassword = function(password: string) {
  if (!this.password) {
    return false;
  }
  return bcrypt.compareSync(password, this.password);
}

export const User = model<UserDocument>('User', UserSchema);
