const cap = (name) => `${name[0].toUpperCase()}${name.substring(1)}`;

const queryUser = (text) => (isNaN(text) ? 'email' : 'phoneNumber');

export { cap, queryUser };
