export function stringToAlt(str) {
  var subst = str?.toLowerCase().replace(/(?:^|\s)\S/g, function (a) {
    return a.toUpperCase();
  });
  return subst;
}
