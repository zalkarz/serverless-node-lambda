'use strict';

const response = require('../../../shared/lib/response');
const mysql = require('serverless-mysql')({
  config: {
    host: process.env.RDS_HOSTNAME,
    user: process.env.RDS_USERNAME,
    password: process.env.RDS_PASSWORD,
    database: process.env.RDS_DATABASE
  }
});

module.exports.list = async (event, context, callback) => {
  try {
    const results = await mysql.query(buildQuery());
    await mysql.end();
    
    if (results.length <= 0) return getStandardResponse(1, null, "");
    return getStandardResponse(1, null, "", results);
     
  } catch (e) {
    return getStandardResponse(0, 1001, "An unexpected error occurred.");
  }  
};

/**
 * Get response format
 * 
 * @param {*} status 
 * @param {*} code 
 * @param {*} message 
 * @param {*} sns_kinds 
 * @returns 
 */
function getStandardResponse(status, code, message, sns_kinds = []) {
  return {
    status,
    sns_kinds,
    error: {
      code,
      message
    }
  } 
}

/**
 * Build query
 * 
 * @returns 
 */
function buildQuery() {
  return `SELECT 
            id,
            name
          FROM user_sns;`
}