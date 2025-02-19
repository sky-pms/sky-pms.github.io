'use strict';
const MANIFEST = 'flutter-app-manifest';
const TEMP = 'flutter-temp-cache';
const CACHE_NAME = 'flutter-app-cache';

const RESOURCES = {"flutter_bootstrap.js": "6d88ed31fc9f8e470f561689d6839758",
"version.json": "22bb3e2fe553fd8a618b1e68cedb8e29",
"index.html": "4d770edab1d8db7636e91a4ecd20fa24",
"/": "4d770edab1d8db7636e91a4ecd20fa24",
"main.dart.js": "78445a5e94997d7fd6f2f461051b9aea",
"flutter.js": "4b2350e14c6650ba82871f60906437ea",
"favicon2.png": "5dcef449791fa27946b3d35ad8803796",
"icons.zip": "d41d8cd98f00b204e9800998ecf8427e",
"favicon.png": "d41d8cd98f00b204e9800998ecf8427e",
"icons/Icon-192.png": "ac9a721a12bbc803b44f645561ecb1e1",
"icons/Icon-maskable-192.png": "a773d2c40f6c224c291449ae45f1676d",
"icons/Icon-maskable-512.png": "301a7604d45b3e739efc881eb04896ea",
"icons/Icon-512.png": "96e752610906ba2a93c65f8abe1645f1",
"manifest.json": "31427eae2125c0e6b317505efaebca3d",
"assets/AssetManifest.json": "be6313aa0764d0824c608fe28067a889",
"assets/NOTICES": "d4c29e80ddbe93ab1776dc18aa444354",
"assets/FontManifest.json": "dc3d03800ccca4601324923c0b1d6d57",
"assets/AssetManifest.bin.json": "bb8af53c7ea0e84f9fe21b01f38d8b53",
"assets/packages/cupertino_icons/assets/CupertinoIcons.ttf": "e986ebe42ef785b27164c36a9abc7818",
"assets/packages/fluttertoast/assets/toastify.js": "56e2c9cedd97f10e7e5f1cebd85d53e3",
"assets/packages/fluttertoast/assets/toastify.css": "a85675050054f179444bc5ad70ffc635",
"assets/shaders/ink_sparkle.frag": "ecc85a2e95f5e9f53123dcaf8cb9b6ce",
"assets/AssetManifest.bin": "463ac4d7b26911e3d26290d0bc18091f",
"assets/fonts/MaterialIcons-Regular.otf": "7d48cc153b52c85ffdbc418de20525d2",
"assets/assets/image/svg/ic_calendar_black.svg": "d5f6b185c3072ce8de707b6c69f65e92",
"assets/assets/image/svg/ic_view_move.svg": "2954a52838c381b646f9f34bbb2e1e3f",
"assets/assets/image/svg/bt_notice02_on.svg": "f8d785fd382e583dae16ea02c186e7e9",
"assets/assets/image/svg/ic_doc.svg": "794068bce229879290e2f1e3d6391b0c",
"assets/assets/image/svg/ic_sign_sub01.svg": "5c595c9a45e038bd01ca2e3452f593b0",
"assets/assets/image/svg/bt_add_project.svg": "12ab1847b942a93f3d482525ecae9f0d",
"assets/assets/image/svg/quick_menu06.svg": "c893c681751ce0b949fba37758d31ff3",
"assets/assets/image/svg/ic_sandglas.svg": "2a03bdecd32519ce2eb98d67152c6744",
"assets/assets/image/svg/ic_pin.svg": "9b902b3d69324efbb8ab0694afe639e3",
"assets/assets/image/svg/quick_menu04.svg": "25312ea449d7ecfc1330017d7647c50a",
"assets/assets/image/svg/ic_pin_big.svg": "862b426b125224f0dbd7ba40cae8abf5",
"assets/assets/image/svg/ic_sign_sub03.svg": "c4acaabb7b1aacde4d96393efce21855",
"assets/assets/image/svg/ic_id.svg": "a61739582f73587596d043a9800c50d1",
"assets/assets/image/svg/num_bg.svg": "dea5b61d18fbfdc4031f7d2150bc2fab",
"assets/assets/image/svg/ic_sign_sub02.svg": "a708ac87732a6ecff2557a296e8988a2",
"assets/assets/image/svg/ic_img_find.svg": "d56d9f17dec7c98e4c8e3011c1db2434",
"assets/assets/image/svg/ic_lock.svg": "9f40a25054fb1659347735ec95d95868",
"assets/assets/image/svg/quick_menu05.svg": "2fae4bb44bbbfeab70a52fe1b584e47f",
"assets/assets/image/svg/ic_excel.svg": "d8b0351aa0fca02d6bd7adb6f1fd3561",
"assets/assets/image/svg/quick_menu01.svg": "deb029f2754ed4d6d25fad5b0a47aa09",
"assets/assets/image/svg/bt_work_on.svg": "23830e5d72c030d626c2571b85b0d046",
"assets/assets/image/svg/PMS_blank.svg": "ce67f6a3d112dcc87f29ee93e84c3c4d",
"assets/assets/image/svg/quick_menu02.svg": "f113bb6e4539f15ba0f50fa24b76c107",
"assets/assets/image/svg/ic_flag.svg": "4a360ef9520ce91e53923e29a4e0a930",
"assets/assets/image/svg/circle_person.svg": "8ba66951f0bc65890961ba5f136cd3bb",
"assets/assets/image/svg/ic_sign_sub04.svg": "496e88bbb41478b3c1a65ff47902ce85",
"assets/assets/image/svg/ic_photo.svg": "527a6ddf6e80d8d73126cce8c43e3e9e",
"assets/assets/image/svg/bt_pencil.svg": "8334f64437b5f7b8cf9e7f889d21177f",
"assets/assets/image/svg/quick_menu03.svg": "6b5aec8517ecf9aa62b76bf145570d6f",
"assets/assets/image/svg/bt_delete.svg": "0915c1e6e4ed860586b632ac0f27a1aa",
"assets/assets/image/svg/menu09.svg": "537134ae55caa08778225996a1fd1d48",
"assets/assets/image/svg/bt_add.svg": "37a717cf59406e0b09dfd7e616f48a76",
"assets/assets/image/svg/ic_home.svg": "9cb1ce7d7eb32a0383f8d6c28dbbea3b",
"assets/assets/image/svg/ic_sign_view01.svg": "b210a90f55874507efec981aac06c839",
"assets/assets/image/svg/ic_user.svg": "3454b82b308d510902796d9e8d92ca71",
"assets/assets/image/svg/ic_calendar_gray.svg": "b1d5753e136002f7c1ae1d6940087a67",
"assets/assets/image/svg/menu08.svg": "8b9564c041f78de28edacfd39c1c6b11",
"assets/assets/image/svg/ic_img.svg": "efbb7ec868cefdfce26777a13a4a6d12",
"assets/assets/image/svg/ic_info_phone.svg": "81f7778ed2bf4e4102ac19833eb744b8",
"assets/assets/image/svg/ic_sign_view02.svg": "63681c27a2a9fc8769d4071493469e63",
"assets/assets/image/svg/bt_notice04_on.svg": "f5f657a25a59df1f4e2d992dd6e26d72",
"assets/assets/image/svg/ic_project_type.svg": "bbcd51a2984a629108a89595906ed6db",
"assets/assets/image/svg/ic_person_check_violet.svg": "99d7aaf763db5b276d3f65a2899ed21f",
"assets/assets/image/svg/ic_sign_view03.svg": "f46ed795949e17ca4cfac6c673e837d2",
"assets/assets/image/svg/ic_calendar.svg": "e85fd6c7f2a1eee3e1458c23f8873712",
"assets/assets/image/svg/arrow_up.svg": "12bd0bbbc37a5dd5c1bda8850257bbb5",
"assets/assets/image/svg/ic_sign_view07.svg": "08a56be28713062cd834f062c65feec2",
"assets/assets/image/svg/ic_file.svg": "06cbc07efe12e93d5c3aae7ef83c1a48",
"assets/assets/image/svg/PMS_app.svg": "1fae0d04e4541b96850f374dc85a0909",
"assets/assets/image/svg/add_blue.svg": "9e311123f8442b8eaf7ae044a250b54a",
"assets/assets/image/svg/ic_sign_view06.svg": "0a3f0d0249647f043140f347cfdc47a3",
"assets/assets/image/svg/add_white.svg": "1179410dee5e7d4358a6628e0ea8198e",
"assets/assets/image/svg/arrow_right.svg": "a8a921eaad8731a11eefa206d00efdcb",
"assets/assets/image/svg/bt_list_on.svg": "036d1c6d0a17a8831c3c55ed44a2ba64",
"assets/assets/image/svg/PMS_login.svg": "8f6a06869acec74dbcf8baf79afef8f3",
"assets/assets/image/svg/ic_sign_view04.svg": "2b2962be40db71b1f4779c14606f0243",
"assets/assets/image/svg/ic_view_popup.svg": "54a23bfc73e235ac6c75771e75ea81e3",
"assets/assets/image/svg/ic_down.svg": "14c832d986bf3164ce55c6176d89bfc9",
"assets/assets/image/svg/ic_sign_view05.svg": "6f0af7178950530091c6d4c0db248845",
"assets/assets/image/svg/ic_job_add.svg": "3d5a74f632038379472d33f5d11bacdb",
"assets/assets/image/svg/more_horiz.svg": "006edb663a7b06e1bc4481fbdeeb56bc",
"assets/assets/image/svg/ic_step1.svg": "deed712e5d54407393cf9313c7c99e18",
"assets/assets/image/svg/ic_new.svg": "929d31afa875520bee919309e9de6742",
"assets/assets/image/svg/ic_sign_view08.svg": "e6105567b25d0bf113af102091542a25",
"assets/assets/image/svg/bt_work.svg": "8429b2d8989f6454bd28d1a986215b7f",
"assets/assets/image/svg/ic_info_mail.svg": "edbea70354063f6ab78c435e6a389717",
"assets/assets/image/svg/ic_sign_process01.svg": "dbdf23a0d5ffd63f76af38676d9da21d",
"assets/assets/image/svg/ic_sign_view09.svg": "63b85efda68580f0ce3cd4a32950cb1d",
"assets/assets/image/svg/arrow_drop_down.svg": "fb704e21113e20d820354866bf7b5252",
"assets/assets/image/svg/menu01.svg": "130cd65ba13c2b94083ea09e97371c6b",
"assets/assets/image/svg/menu03.svg": "3d6ee798909d5af6b08e04539bedde92",
"assets/assets/image/svg/ic_step2.svg": "75aeb94991166d9e371fbb3e5db89413",
"assets/assets/image/svg/bt_notice03_on.svg": "8bc8f83b869ed5c40b14f79be5a0653c",
"assets/assets/image/svg/ic_sign_process03.svg": "f7745a0c43d3efab43eb8d444522b40c",
"assets/assets/image/svg/bt_notice05.svg": "69f2571199791e3cf1f36971df4b0117",
"assets/assets/image/svg/arrow_down.svg": "d8925d01af2406f1001e446cd41833b7",
"assets/assets/image/svg/bt_notice04.svg": "7f07c2550dcaef7a7bb4386d8e6bebaf",
"assets/assets/image/svg/ic_sign_process02.svg": "6cb1a2ec500787c3755f33a56abccf4c",
"assets/assets/image/svg/ic_step3.svg": "2bf444407efb6227184fe9f4f87ded48",
"assets/assets/image/svg/ic_info_lock.svg": "0af90204cba88e869634ef1cd15be91a",
"assets/assets/image/svg/menu02.svg": "606b24a93cf8bfa4b3573e8c4a5ea998",
"assets/assets/image/svg/menu12.svg": "0ca8d3ffdbf39c696702ce47256f7aac",
"assets/assets/image/svg/menu06.svg": "8bf3e355b285ed02906b12375b1e5041",
"assets/assets/image/svg/bt_notice01_on.svg": "6282d318f92e92d5bef4df3d735d480d",
"assets/assets/image/svg/bt_logout.svg": "77eb520d0d3e5102efe71e4de94b159a",
"assets/assets/image/svg/ic_job_add_black.svg": "5b3da5ca26a9b5f347940e8f4a19a4e8",
"assets/assets/image/svg/bt_notice01.svg": "b0934cbb89bc909afba2dd29ee422e1f",
"assets/assets/image/svg/menu07.svg": "a4cef8f7caf1be4ee38596c4ea0dfc34",
"assets/assets/image/svg/checklist.svg": "d132583f5141d9be5005d620c9ac9c35",
"assets/assets/image/svg/menu13.svg": "41cb2ebf806c8caa16e39789db3338d2",
"assets/assets/image/svg/menu05.svg": "cb9de73fea226571971a012145a18acf",
"assets/assets/image/svg/menu11.svg": "01a299e522e9a10639f7d17ae7d99641",
"assets/assets/image/svg/ic_step4.svg": "fe5c2b35267d3ad627f2e1351cabbaa7",
"assets/assets/image/svg/ic_arrow_down.svg": "4c425388f0a7e6d94d58c382f441c4b4",
"assets/assets/image/svg/ic_sign_process05.svg": "61dc0aed7027a1df8768859c97225701",
"assets/assets/image/svg/bt_notice03.svg": "1bc3edc1d3766b30e4588fe6e62afd71",
"assets/assets/image/svg/bt_notice02.svg": "25d339a90a901ca645a297783a4985f6",
"assets/assets/image/svg/ic_sign_process04.svg": "f66a33e9163abd3f237d2284bca2a25b",
"assets/assets/image/svg/ic_step5.svg": "ab71c351f7284a95791cbcacaab4b919",
"assets/assets/image/svg/menu10.svg": "537134ae55caa08778225996a1fd1d48",
"assets/assets/image/svg/menu04.svg": "e6f983c8145ff5e0efc2c6a8c1a283a5",
"assets/assets/image/svg/ic_person.svg": "666dc4cd6818ea2a37bdc6cf342f1a5c",
"assets/assets/image/svg/ic_sign_step01.svg": "7cb392166f56417e0fc55cceaa377c9b",
"assets/assets/image/svg/ic_sign_img02.svg": "5df9bc840f5a642e1c49759029f5a1e7",
"assets/assets/image/svg/ic_process03.svg": "5030ffe256231a79f2bbd5372336a8da",
"assets/assets/image/svg/ic_chat.svg": "d117955277d9b79905eb1347c445b610",
"assets/assets/image/svg/ic_person_check_gray.svg": "357a4b7cea88fbd5b8bcceb155028b3c",
"assets/assets/image/svg/bt_notice05_on.svg": "b0359e6dc947eb0fed381a08e41d29e7",
"assets/assets/image/svg/ic_process02.svg": "68fcb3b8fab9564622e1811713c95a13",
"assets/assets/image/svg/ic_sign_img03.svg": "f736f0f9a8786a8ed41541430d987b36",
"assets/assets/image/svg/ic_lock_open.svg": "398961aa70f55cc9efce871cc23d9aad",
"assets/assets/image/svg/ic_wbs.svg": "f08c232c9563cd29ac6b3d0d99176228",
"assets/assets/image/svg/ic_pass.svg": "86980be3f6665bbdb74fc63d73819e8e",
"assets/assets/image/svg/bt_down.svg": "5fcde2b6fd5c3070632c0d5345aa3bf7",
"assets/assets/image/svg/ic_sign_step02.svg": "cdad95999fd49e886f0639581768c4fa",
"assets/assets/image/svg/ic_sign_img01.svg": "2ba2b590b7ab511dfda717efd2a45f61",
"assets/assets/image/svg/calendar.svg": "4debb3304c6e6a565b23c3678f526580",
"assets/assets/image/svg/ic_process01.svg": "b87093e9397880553168774df1c4b4b6",
"assets/assets/image/svg/arrow_drop_down_up.svg": "5b83c847cfca132069075fc60a7783c0",
"assets/assets/image/svg/ic_sign_step03.svg": "d57dccbdbfb6133a4502bed56e6e4af0",
"assets/assets/image/svg/ic_info_company.svg": "a1518457e1a26900d7b95f73d0f3d36f",
"assets/assets/image/svg/ic_view_wave.svg": "d387b9dcb09ad9dc8b586556ac7f8d32",
"assets/assets/image/svg/ic_person_green.svg": "d53341280c275b448fe3bc09b057ac83",
"assets/assets/image/svg/ic_sign_img04.svg": "59bc7c82e15e87848c1a9e12297d37f4",
"assets/assets/image/svg/ic_process05.svg": "b9ecdc4997e50e91074645ff2e0ae69c",
"assets/assets/image/svg/ic_process04.svg": "9d39489b47f79dc6dab23ac195d19f19",
"assets/assets/image/svg/ic_arrow_up.svg": "12361ee04e5d4c01f841f27d08ecf3aa",
"assets/assets/image/svg/ic_sign_img05.svg": "9900cc1bdd29eb8a8fab21ede26f410c",
"assets/assets/image/svg/ic_sign_step06.svg": "20142f4b0716b901328015ed00b9b07b",
"assets/assets/image/svg/ic_edit.svg": "94d12096eb02e69054ff51359dcbff25",
"assets/assets/image/svg/ic_pdf.svg": "5280979dec5e0128dd20eafccb04e630",
"assets/assets/image/svg/ic_sign_step04.svg": "0fb020786a435899f8aa6f051fca5171",
"assets/assets/image/svg/ic_star.svg": "8a4a984cdc18b9f446ecd5bac0970ead",
"assets/assets/image/svg/ic_ppt.svg": "2bf1fcd58c872aa27b4ae8733ccd6555",
"assets/assets/image/svg/ic_sign_img07.svg": "1eac45063c88343af8b1490287da4760",
"assets/assets/image/svg/bt_add_round.svg": "7f94ceb89028428e9c59b1c3bb839fcb",
"assets/assets/image/svg/ic_process06.svg": "a3ac7cb87c3e5d0681f976ddcda0b8d0",
"assets/assets/image/svg/ic_process07.svg": "56845c044ff80896809800eb5bc6c7ad",
"assets/assets/image/svg/ic_sign_img06.svg": "9e78414ea245abf49bf13f86e974a505",
"assets/assets/image/svg/bt_list.svg": "036613dc66d45a826e300d1cce77966b",
"assets/assets/image/svg/ic_sign_step05.svg": "930cb38b28c3bf96ce3bc1808e4c9cf7",
"assets/assets/image/svg/ic_file_black.svg": "cc4cd68f09aa9e8aba112e30cffacc7a",
"assets/assets/image/logo.png": "8910c5ee6371256baeb87bdf35eced23",
"assets/assets/image/emoticon_5.png": "61c3f4e03769ef438a921bc83b578e60",
"assets/assets/wbs_html/week-div-origin.html": "e40b921bbc0e372cfe74f67b2c4587fe",
"assets/assets/wbs_html/css/bootstrap.min.css": "94dada39a33f556e82672d342febb1cd",
"assets/assets/wbs_html/css/custom-land.css": "794c620beed48136839d4eb06e20b9a0",
"assets/assets/wbs_html/css/week-div.css": "cd72c4ccabe13ccb4c4e6e7ca30b718f",
"assets/assets/wbs_html/css/custom.css": "286e234d00adab3e9ba1ead312d007ae",
"assets/assets/wbs_html/js/moment-range.js": "e9ec840bf9a6d0c2a4a6104ab6fa3113",
"assets/assets/wbs_html/js/util_script.js": "82b9b0c1d2d5b7661b791d93bfa32f99",
"assets/assets/wbs_html/js/handle_ui_2.js": "411bc2cc6a28a06417a27c5a4da96aef",
"assets/assets/wbs_html/js/jquery.min.js": "220afd743d9e9643852e31a135a9f3ae",
"assets/assets/wbs_html/js/sample_data.js": "0d1bf0e0d0ead15be0b8b9559ab5fc39",
"assets/assets/wbs_html/js/moment.min.js": "e58496fa58c7988be8592010c00d4aa8",
"assets/assets/wbs_html/img/slider_handle.png": "879c31c66a829c9d5293473d181660ef",
"assets/assets/wbs_html/img/grid.png": "9d122d53bb0013d143e543f50fab1388",
"assets/assets/wbs_html/img/icon_sprite.png": "9488aaf4bd8e88f1d87bd0b807529686",
"assets/assets/wbs_html/week-div.html": "61a6e06d1c71e521b57ac8b96c844e71",
"canvaskit/skwasm.js": "ac0f73826b925320a1e9b0d3fd7da61c",
"canvaskit/skwasm.js.symbols": "96263e00e3c9bd9cd878ead867c04f3c",
"canvaskit/canvaskit.js.symbols": "efc2cd87d1ff6c586b7d4c7083063a40",
"canvaskit/skwasm.wasm": "828c26a0b1cc8eb1adacbdd0c5e8bcfa",
"canvaskit/chromium/canvaskit.js.symbols": "e115ddcfad5f5b98a90e389433606502",
"canvaskit/chromium/canvaskit.js": "b7ba6d908089f706772b2007c37e6da4",
"canvaskit/chromium/canvaskit.wasm": "ea5ab288728f7200f398f60089048b48",
"canvaskit/canvaskit.js": "26eef3024dbc64886b7f48e1b6fb05cf",
"canvaskit/canvaskit.wasm": "e7602c687313cfac5f495c5eac2fb324",
"canvaskit/skwasm.worker.js": "89990e8c92bcb123999aa81f7e203b1c"};
// The application shell files that are downloaded before a service worker can
// start.
const CORE = ["main.dart.js",
"index.html",
"flutter_bootstrap.js",
"assets/AssetManifest.bin.json",
"assets/FontManifest.json"];

// During install, the TEMP cache is populated with the application shell files.
self.addEventListener("install", (event) => {
  self.skipWaiting();
  return event.waitUntil(
    caches.open(TEMP).then((cache) => {
      return cache.addAll(
        CORE.map((value) => new Request(value, {'cache': 'reload'})));
    })
  );
});
// During activate, the cache is populated with the temp files downloaded in
// install. If this service worker is upgrading from one with a saved
// MANIFEST, then use this to retain unchanged resource files.
self.addEventListener("activate", function(event) {
  return event.waitUntil(async function() {
    try {
      var contentCache = await caches.open(CACHE_NAME);
      var tempCache = await caches.open(TEMP);
      var manifestCache = await caches.open(MANIFEST);
      var manifest = await manifestCache.match('manifest');
      // When there is no prior manifest, clear the entire cache.
      if (!manifest) {
        await caches.delete(CACHE_NAME);
        contentCache = await caches.open(CACHE_NAME);
        for (var request of await tempCache.keys()) {
          var response = await tempCache.match(request);
          await contentCache.put(request, response);
        }
        await caches.delete(TEMP);
        // Save the manifest to make future upgrades efficient.
        await manifestCache.put('manifest', new Response(JSON.stringify(RESOURCES)));
        // Claim client to enable caching on first launch
        self.clients.claim();
        return;
      }
      var oldManifest = await manifest.json();
      var origin = self.location.origin;
      for (var request of await contentCache.keys()) {
        var key = request.url.substring(origin.length + 1);
        if (key == "") {
          key = "/";
        }
        // If a resource from the old manifest is not in the new cache, or if
        // the MD5 sum has changed, delete it. Otherwise the resource is left
        // in the cache and can be reused by the new service worker.
        if (!RESOURCES[key] || RESOURCES[key] != oldManifest[key]) {
          await contentCache.delete(request);
        }
      }
      // Populate the cache with the app shell TEMP files, potentially overwriting
      // cache files preserved above.
      for (var request of await tempCache.keys()) {
        var response = await tempCache.match(request);
        await contentCache.put(request, response);
      }
      await caches.delete(TEMP);
      // Save the manifest to make future upgrades efficient.
      await manifestCache.put('manifest', new Response(JSON.stringify(RESOURCES)));
      // Claim client to enable caching on first launch
      self.clients.claim();
      return;
    } catch (err) {
      // On an unhandled exception the state of the cache cannot be guaranteed.
      console.error('Failed to upgrade service worker: ' + err);
      await caches.delete(CACHE_NAME);
      await caches.delete(TEMP);
      await caches.delete(MANIFEST);
    }
  }());
});
// The fetch handler redirects requests for RESOURCE files to the service
// worker cache.
self.addEventListener("fetch", (event) => {
  if (event.request.method !== 'GET') {
    return;
  }
  var origin = self.location.origin;
  var key = event.request.url.substring(origin.length + 1);
  // Redirect URLs to the index.html
  if (key.indexOf('?v=') != -1) {
    key = key.split('?v=')[0];
  }
  if (event.request.url == origin || event.request.url.startsWith(origin + '/#') || key == '') {
    key = '/';
  }
  // If the URL is not the RESOURCE list then return to signal that the
  // browser should take over.
  if (!RESOURCES[key]) {
    return;
  }
  // If the URL is the index.html, perform an online-first request.
  if (key == '/') {
    return onlineFirst(event);
  }
  event.respondWith(caches.open(CACHE_NAME)
    .then((cache) =>  {
      return cache.match(event.request).then((response) => {
        // Either respond with the cached resource, or perform a fetch and
        // lazily populate the cache only if the resource was successfully fetched.
        return response || fetch(event.request).then((response) => {
          if (response && Boolean(response.ok)) {
            cache.put(event.request, response.clone());
          }
          return response;
        });
      })
    })
  );
});
self.addEventListener('message', (event) => {
  // SkipWaiting can be used to immediately activate a waiting service worker.
  // This will also require a page refresh triggered by the main worker.
  if (event.data === 'skipWaiting') {
    self.skipWaiting();
    return;
  }
  if (event.data === 'downloadOffline') {
    downloadOffline();
    return;
  }
});
// Download offline will check the RESOURCES for all files not in the cache
// and populate them.
async function downloadOffline() {
  var resources = [];
  var contentCache = await caches.open(CACHE_NAME);
  var currentContent = {};
  for (var request of await contentCache.keys()) {
    var key = request.url.substring(origin.length + 1);
    if (key == "") {
      key = "/";
    }
    currentContent[key] = true;
  }
  for (var resourceKey of Object.keys(RESOURCES)) {
    if (!currentContent[resourceKey]) {
      resources.push(resourceKey);
    }
  }
  return contentCache.addAll(resources);
}
// Attempt to download the resource online before falling back to
// the offline cache.
function onlineFirst(event) {
  return event.respondWith(
    fetch(event.request).then((response) => {
      return caches.open(CACHE_NAME).then((cache) => {
        cache.put(event.request, response.clone());
        return response;
      });
    }).catch((error) => {
      return caches.open(CACHE_NAME).then((cache) => {
        return cache.match(event.request).then((response) => {
          if (response != null) {
            return response;
          }
          throw error;
        });
      });
    })
  );
}
