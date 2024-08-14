import moduleAlias from 'module-alias';
import path from 'path';

const srcDir = path.resolve(__dirname, '../');

moduleAlias.addAliases({
    "@logger": path.resolve(srcDir, "util", "logger"),
    "@environment": path.resolve(srcDir, "util", "environment"),
    "@hackbox": path.resolve(srcDir, "HackboxServer"),
    "@hackbox/manager": path.resolve(srcDir, "managers", "Manager"),
    "@hackbox/managers": path.resolve(srcDir, "managers"),
});