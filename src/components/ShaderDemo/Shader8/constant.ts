/*
 * @Date: 2022-08-02 10:36:48
 * @LastEditors: changgeee
 * @LastEditTime: 2022-08-19 10:30:24
 * @FilePath: \ipems-r\src\views\scene\camera\index.d.ts
 */

export interface WeatherRainOptions {
  /** type?: 'rain';*/
  /** 是否开启 */
  enabled?: boolean;
  /** 雨水下落速度 */
  speed?: number;
  /** 雨滴数量 */
  quantity?: number;
  /** 雨滴倾斜角 */
  angle?:number;
}

export interface WeatherSnowOptions {
  /**type?: 'snow';*/
  /** 是否开启 */
  enabled?: boolean;
  /** 雨水下落速度 */
  speed?: number;
  /** 雨滴数量 */
  quantity?: number;
  /** 雨滴倾斜角 */
  density?:number;
  /** 雨滴倾斜角 */
  size?:number;
}
