const getErrMsg = (errType) => {
  let errMsg = '';
  switch (errType) {
    case 'email':
      errMsg = 'Must provide an email address';
      break;
    case 'unauthorized':
      errMsg = 'Invalid Credentials';
      break;
    case 'forbidden':
      errMsg = "You don't have permission to access this source";
      break;
    default:
      errMsg = 'Invalid Credentials';
      break;
  }

  return errMsg;
};

export default getErrMsg;
