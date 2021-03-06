// Gravity
// 9.8 m/s2
// We use ms as time
// Suppose that 1 px is 1 mm than
// 1 m = 1000 mm
// 9.8 * 1000 mm / (1000 ms * 1000 ms)
// 9.8 * 1000 / ( 1000 * 1000 ) =0.0098 px/ms2
const GRAVITY_ACCELERATION = 0.098;
const GAME_AREA_BORDER = 100; // px
const MAX_POWER_INIT = 100;
const POWER_BOOST = 5;
const GAME_NAME = "Ball Game v1.0";

export { GRAVITY_ACCELERATION, GAME_AREA_BORDER, MAX_POWER_INIT, POWER_BOOST, GAME_NAME }
