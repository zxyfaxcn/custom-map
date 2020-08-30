class Map {
    //构造方法
    constructor(options) {
        options = Object.assign({id: "map", center: new LonLat(0, 0), zoom: 0}, options)
        this.id = options.id;
        this.container = document.querySelector(`#${this.id}`);
        this.container.className = "map-container";
        this.center = options.center;
        this.zoom = options.zoom;
        this.resolutions = options.resolutions ||
            [
                156543.03392804103, 78271.516964020513, 39135.758482010257, 19567.879241005128, 9783.9396205025641,
                4891.9698102512821, 2445.984905125641, 1222.9924525628205, 611.49622628141026,  305.74811314070513,
                152.87405657035256, 76.437028285176282, 38.218514142588141, 19.109257071294071, 9.5546285356470353,
                4.7773142678235176, 2.3886571339117588, 1.1943285669558794, 0.59716428347793971,0.29858214173896985,
                0.14929107086948493,0.074645535434742463,0.037322767717371232
            ];
        this.tileLayer = {};
        this.mapPane = document.createElement("div");
        this.mapPane.className = "map-pane";
        this.container.appendChild(this.mapPane);
        this.mapTilePane = document.createElement("div");
        this.mapTilePane.className = "map-tile-pane";
        this.mapPane.appendChild(this.mapTilePane);
        this.des = document.createElement("div");
        this.container.appendChild(this.des);
        this.des.className = "map-des";
        this.des.innerHTML = "GIS日刊";
        this.size = new Point(
            this.container.clientWidth,
            this.container.clientHeight
        );
        this.padding = 2;
        this.project = new Project();
    }

    setCenter(centerLonLat, zoom) {
        this.center = centerLonLat;
        this.zoom = zoom;
    }

    addTileLayer(options) {
        let tile = this.tileLayer[options.id] = new Tile(options);
        tile.onAdd(this);
    }

    /** 经纬度转换屏幕坐标*/
    lonlat2pixls (lonlat) {
        let {center, zoom, project, resolutions, size} = this;
        let projectCenter = project.project(center),
            projectLonlat = project.project(lonlat),
            resolution = resolutions[zoom];
        //1 计算目标点和地图中心点地图单位（默认米）的差值
        let dMeter = projectLonlat.sub(projectCenter.x, projectCenter.y);
        //2 计算目标点和地图中心点像素差值
        let dPixel = dMeter.divide(resolution, -resolution);
        //3 计算地图中心点屏幕坐标
        let centerPixel = size.divide(2, 2);
        //4 计算目标经纬度屏幕坐标
        let pixel = dPixel.add(centerPixel.x, centerPixel.y);
        return pixel;
    }

    addLayer(layer) {
        layer.onAdd(this);
    }
}