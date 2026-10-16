/**
 * 世界板块图 · 坐标为初估，请拖动后「锁死位置」
 */
window.GEO_MAPS = window.GEO_MAPS || {};

window.GEO_MAPS["plates"] = {
  id: "plates",
  mapType: "plates",
  title: "世界板块构造图",
  subtitle: "点击标注查看六大板块名称与要点",
  mapImage: "assets/plates.jpg",
  mapWidth: 4908,
  mapHeight: 3473,
  marker: { hit: 112, ring: 58, dot: 40 },
  points: [
    {
      id: "pacific_plate",
      name: "太平洋板块",
      category: "大洋板块",
      x: 3119,
      y: 1786,
      note: "面积最大的板块，几乎全部为太平洋洋壳，环太平洋火山地震带与其边界密切相关",
    },
    {
      id: "indian_plate",
      name: "印度洋板块",
      category: "大洋板块",
      x: 1809,
      y: 2155,
      note: "包括印度洋大部、印度次大陆与澳大利亚，向北与亚欧板块碰撞形成喜马拉雅山",
    },
    {
      id: "eurasian_plate",
      name: "亚欧板块",
      category: "大陆板块",
      x: 1821,
      y: 956,
      note: "欧洲与亚洲大陆主体，西接大西洋中脊，南缘与印度、菲律宾等板块交界",
    },
    {
      id: "american_plate",
      name: "美洲板块",
      category: "大陆板块",
      x: 4223,
      y: 1377,
      note: "北美与南美大陆及邻近洋底，东缘以大西洋中脊与非洲板块分离",
    },
    {
      id: "antarctic_plate",
      name: "南极洲板块",
      category: "大陆板块",
      x: 3715,
      y: 2919,
      note: "以南极大陆为核心，几乎被环南极的海岭与俯冲带环绕",
    },
    {
      id: "african_plate",
      name: "非洲板块",
      category: "大陆板块",
      x: 699,
      y: 1805,
      note: "非洲大陆及东南印度洋部分洋壳，东非大裂谷为板块内部拉伸典型",
    },
  ],
};
