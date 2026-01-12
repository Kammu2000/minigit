const MODE = {
  BLOB: "100644", 
  TREE: "040000"
};

const MODE_VS_TYPE = {
  "100644": "BLOB",
  "040000": "TREE",
}

module.exports = { MODE, MODE_VS_TYPE };
