const { test } = require("node:test");
const assert = require("node:assert");
const { menuFlags } = require("../helpers/menuFlags");

test("visitor sees no role menu", () => {
  assert.deepStrictEqual(menuFlags(null), { adm: false, prof: false, aluno: false });
});

test("roles map to menu flags", () => {
  assert.deepStrictEqual(menuFlags({ eAdmin: 1, eProfessor: 0 }), { adm: true, prof: false, aluno: false });
  assert.deepStrictEqual(menuFlags({ eAdmin: 0, eProfessor: 1 }), { adm: false, prof: true, aluno: false });
  assert.deepStrictEqual(menuFlags({ eAdmin: 0, eProfessor: 0 }), { adm: false, prof: false, aluno: true });
});
