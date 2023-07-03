import mongoose from 'mongoose';

const { Schema } = mongoose;

const contactSchema = Schema({
  name: {
    type: Map,
    of: String,
  },
  email: {
    type: Map,
    of: String,
  },
  phoneNumber: {
    type: Map,
    of: String,
  },
});

const Contact = mongoose.model('Contact', contactSchema);

export default Contact;
