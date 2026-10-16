/* tslint:disable */
/* eslint-disable */
/**
* Gets feature flags.
*
* Flag | Value
* -----|-------
* 0x01 | `VEX`
* 0x02 | `EVEX`
* 0x04 | `XOP`
* 0x08 | `3DNow!`
* 0x10 | `MVEX`
* @returns {number}
*/
export function getIcedFeatures(): number;
/**
* x86 instruction code
*/
export enum Code {
  INVALID = 0,
  DeclareByte = 1,
  DeclareWord = 2,
  DeclareDword = 3,
  DeclareQword = 4,
  Add_rm8_r8 = 5,
  Add_rm16_r16 = 6,
  Add_rm32_r32 = 7,
  Add_rm64_r64 = 8,
  Add_r8_rm8 = 9,
  Add_r16_rm16 = 10,
  Add_r32_rm32 = 11,
  Add_r64_rm64 = 12,
  Add_AL_imm8 = 13,
  Add_AX_imm16 = 14,
  Add_EAX_imm32 = 15,
  Add_RAX_imm32 = 16,
  Pushw_ES = 17,
  Pushd_ES = 18,
  Popw_ES = 19,
  Popd_ES = 20,
  Or_rm8_r8 = 21,
  Or_rm16_r16 = 22,
  Or_rm32_r32 = 23,
  Or_rm64_r64 = 24,
  Or_r8_rm8 = 25,
  Or_r16_rm16 = 26,
  Or_r32_rm32 = 27,
  Or_r64_rm64 = 28,
  Or_AL_imm8 = 29,
  Or_AX_imm16 = 30,
  Or_EAX_imm32 = 31,
  Or_RAX_imm32 = 32,
  Pushw_CS = 33,
  Pushd_CS = 34,
  Popw_CS = 35,
  Adc_rm8_r8 = 36,
  Adc_rm16_r16 = 37,
  Adc_rm32_r32 = 38,
  Adc_rm64_r64 = 39,
  Adc_r8_rm8 = 40,
  Adc_r16_rm16 = 41,
  Adc_r32_rm32 = 42,
  Adc_r64_rm64 = 43,
  Adc_AL_imm8 = 44,
  Adc_AX_imm16 = 45,
  Adc_EAX_imm32 = 46,
  Adc_RAX_imm32 = 47,
  Pushw_SS = 48,
  Pushd_SS = 49,
  Popw_SS = 50,
  Popd_SS = 51,
  Sbb_rm8_r8 = 52,
  Sbb_rm16_r16 = 53,
  Sbb_rm32_r32 = 54,
  Sbb_rm64_r64 = 55,
  Sbb_r8_rm8 = 56,
  Sbb_r16_rm16 = 57,
  Sbb_r32_rm32 = 58,
  Sbb_r64_rm64 = 59,
  Sbb_AL_imm8 = 60,
  Sbb_AX_imm16 = 61,
  Sbb_EAX_imm32 = 62,
  Sbb_RAX_imm32 = 63,
  Pushw_DS = 64,
  Pushd_DS = 65,
  Popw_DS = 66,
  Popd_DS = 67,
  And_rm8_r8 = 68,
  And_rm16_r16 = 69,
  And_rm32_r32 = 70,
  And_rm64_r64 = 71,
  And_r8_rm8 = 72,
  And_r16_rm16 = 73,
  And_r32_rm32 = 74,
  And_r64_rm64 = 75,
  And_AL_imm8 = 76,
  And_AX_imm16 = 77,
  And_EAX_imm32 = 78,
  And_RAX_imm32 = 79,
  Daa = 80,
  Sub_rm8_r8 = 81,
  Sub_rm16_r16 = 82,
  Sub_rm32_r32 = 83,
  Sub_rm64_r64 = 84,
  Sub_r8_rm8 = 85,
  Sub_r16_rm16 = 86,
  Sub_r32_rm32 = 87,
  Sub_r64_rm64 = 88,
  Sub_AL_imm8 = 89,
  Sub_AX_imm16 = 90,
  Sub_EAX_imm32 = 91,
  Sub_RAX_imm32 = 92,
  Das = 93,
  Xor_rm8_r8 = 94,
  Xor_rm16_r16 = 95,
  Xor_rm32_r32 = 96,
  Xor_rm64_r64 = 97,
  Xor_r8_rm8 = 98,
  Xor_r16_rm16 = 99,
  Xor_r32_rm32 = 100,
  Xor_r64_rm64 = 101,
  Xor_AL_imm8 = 102,
  Xor_AX_imm16 = 103,
  Xor_EAX_imm32 = 104,
  Xor_RAX_imm32 = 105,
  Aaa = 106,
  Cmp_rm8_r8 = 107,
  Cmp_rm16_r16 = 108,
  Cmp_rm32_r32 = 109,
  Cmp_rm64_r64 = 110,
  Cmp_r8_rm8 = 111,
  Cmp_r16_rm16 = 112,
  Cmp_r32_rm32 = 113,
  Cmp_r64_rm64 = 114,
  Cmp_AL_imm8 = 115,
  Cmp_AX_imm16 = 116,
  Cmp_EAX_imm32 = 117,
  Cmp_RAX_imm32 = 118,
  Aas = 119,
  Inc_r16 = 120,
  Inc_r32 = 121,
  Dec_r16 = 122,
  Dec_r32 = 123,
  Push_r16 = 124,
  Push_r32 = 125,
  Push_r64 = 126,
  Pop_r16 = 127,
  Pop_r32 = 128,
  Pop_r64 = 129,
  Pushaw = 130,
  Pushad = 131,
  Popaw = 132,
  Popad = 133,
  Bound_r16_m1616 = 134,
  Bound_r32_m3232 = 135,
  Arpl_rm16_r16 = 136,
  Arpl_r32m16_r32 = 137,
  Movsxd_r16_rm16 = 138,
  Movsxd_r32_rm32 = 139,
  Movsxd_r64_rm32 = 140,
  Push_imm16 = 141,
  Pushd_imm32 = 142,
  Pushq_imm32 = 143,
  Imul_r16_rm16_imm16 = 144,
  Imul_r32_rm32_imm32 = 145,
  Imul_r64_rm64_imm32 = 146,
  Pushw_imm8 = 147,
  Pushd_imm8 = 148,
  Pushq_imm8 = 149,
  Imul_r16_rm16_imm8 = 150,
  Imul_r32_rm32_imm8 = 151,
  Imul_r64_rm64_imm8 = 152,
  Insb_m8_DX = 153,
  Insw_m16_DX = 154,
  Insd_m32_DX = 155,
  Outsb_DX_m8 = 156,
  Outsw_DX_m16 = 157,
  Outsd_DX_m32 = 158,
  Jo_rel8_16 = 159,
  Jo_rel8_32 = 160,
  Jo_rel8_64 = 161,
  Jno_rel8_16 = 162,
  Jno_rel8_32 = 163,
  Jno_rel8_64 = 164,
  Jb_rel8_16 = 165,
  Jb_rel8_32 = 166,
  Jb_rel8_64 = 167,
  Jae_rel8_16 = 168,
  Jae_rel8_32 = 169,
  Jae_rel8_64 = 170,
  Je_rel8_16 = 171,
  Je_rel8_32 = 172,
  Je_rel8_64 = 173,
  Jne_rel8_16 = 174,
  Jne_rel8_32 = 175,
  Jne_rel8_64 = 176,
  Jbe_rel8_16 = 177,
  Jbe_rel8_32 = 178,
  Jbe_rel8_64 = 179,
  Ja_rel8_16 = 180,
  Ja_rel8_32 = 181,
  Ja_rel8_64 = 182,
  Js_rel8_16 = 183,
  Js_rel8_32 = 184,
  Js_rel8_64 = 185,
  Jns_rel8_16 = 186,
  Jns_rel8_32 = 187,
  Jns_rel8_64 = 188,
  Jp_rel8_16 = 189,
  Jp_rel8_32 = 190,
  Jp_rel8_64 = 191,
  Jnp_rel8_16 = 192,
  Jnp_rel8_32 = 193,
  Jnp_rel8_64 = 194,
  Jl_rel8_16 = 195,
  Jl_rel8_32 = 196,
  Jl_rel8_64 = 197,
  Jge_rel8_16 = 198,
  Jge_rel8_32 = 199,
  Jge_rel8_64 = 200,
  Jle_rel8_16 = 201,
  Jle_rel8_32 = 202,
  Jle_rel8_64 = 203,
  Jg_rel8_16 = 204,
  Jg_rel8_32 = 205,
  Jg_rel8_64 = 206,
  Add_rm8_imm8 = 207,
  Or_rm8_imm8 = 208,
  Adc_rm8_imm8 = 209,
  Sbb_rm8_imm8 = 210,
  And_rm8_imm8 = 211,
  Sub_rm8_imm8 = 212,
  Xor_rm8_imm8 = 213,
  Cmp_rm8_imm8 = 214,
  Add_rm16_imm16 = 215,
  Add_rm32_imm32 = 216,
  Add_rm64_imm32 = 217,
  Or_rm16_imm16 = 218,
  Or_rm32_imm32 = 219,
  Or_rm64_imm32 = 220,
  Adc_rm16_imm16 = 221,
  Adc_rm32_imm32 = 222,
  Adc_rm64_imm32 = 223,
  Sbb_rm16_imm16 = 224,
  Sbb_rm32_imm32 = 225,
  Sbb_rm64_imm32 = 226,
  And_rm16_imm16 = 227,
  And_rm32_imm32 = 228,
  And_rm64_imm32 = 229,
  Sub_rm16_imm16 = 230,
  Sub_rm32_imm32 = 231,
  Sub_rm64_imm32 = 232,
  Xor_rm16_imm16 = 233,
  Xor_rm32_imm32 = 234,
  Xor_rm64_imm32 = 235,
  Cmp_rm16_imm16 = 236,
  Cmp_rm32_imm32 = 237,
  Cmp_rm64_imm32 = 238,
  Add_rm8_imm8_82 = 239,
  Or_rm8_imm8_82 = 240,
  Adc_rm8_imm8_82 = 241,
  Sbb_rm8_imm8_82 = 242,
  And_rm8_imm8_82 = 243,
  Sub_rm8_imm8_82 = 244,
  Xor_rm8_imm8_82 = 245,
  Cmp_rm8_imm8_82 = 246,
  Add_rm16_imm8 = 247,
  Add_rm32_imm8 = 248,
  Add_rm64_imm8 = 249,
  Or_rm16_imm8 = 250,
  Or_rm32_imm8 = 251,
  Or_rm64_imm8 = 252,
  Adc_rm16_imm8 = 253,
  Adc_rm32_imm8 = 254,
  Adc_rm64_imm8 = 255,
  Sbb_rm16_imm8 = 256,
  Sbb_rm32_imm8 = 257,
  Sbb_rm64_imm8 = 258,
  And_rm16_imm8 = 259,
  And_rm32_imm8 = 260,
  And_rm64_imm8 = 261,
  Sub_rm16_imm8 = 262,
  Sub_rm32_imm8 = 263,
  Sub_rm64_imm8 = 264,
  Xor_rm16_imm8 = 265,
  Xor_rm32_imm8 = 266,
  Xor_rm64_imm8 = 267,
  Cmp_rm16_imm8 = 268,
  Cmp_rm32_imm8 = 269,
  Cmp_rm64_imm8 = 270,
  Test_rm8_r8 = 271,
  Test_rm16_r16 = 272,
  Test_rm32_r32 = 273,
  Test_rm64_r64 = 274,
  Xchg_rm8_r8 = 275,
  Xchg_rm16_r16 = 276,
  Xchg_rm32_r32 = 277,
  Xchg_rm64_r64 = 278,
  Mov_rm8_r8 = 279,
  Mov_rm16_r16 = 280,
  Mov_rm32_r32 = 281,
  Mov_rm64_r64 = 282,
  Mov_r8_rm8 = 283,
  Mov_r16_rm16 = 284,
  Mov_r32_rm32 = 285,
  Mov_r64_rm64 = 286,
  Mov_rm16_Sreg = 287,
  Mov_r32m16_Sreg = 288,
  Mov_r64m16_Sreg = 289,
  Lea_r16_m = 290,
  Lea_r32_m = 291,
  Lea_r64_m = 292,
  Mov_Sreg_rm16 = 293,
  Mov_Sreg_r32m16 = 294,
  Mov_Sreg_r64m16 = 295,
  Pop_rm16 = 296,
  Pop_rm32 = 297,
  Pop_rm64 = 298,
  Nopw = 299,
  Nopd = 300,
  Nopq = 301,
  Xchg_r16_AX = 302,
  Xchg_r32_EAX = 303,
  Xchg_r64_RAX = 304,
  Pause = 305,
  Cbw = 306,
  Cwde = 307,
  Cdqe = 308,
  Cwd = 309,
  Cdq = 310,
  Cqo = 311,
  Call_ptr1616 = 312,
  Call_ptr1632 = 313,
  Wait = 314,
  Pushfw = 315,
  Pushfd = 316,
  Pushfq = 317,
  Popfw = 318,
  Popfd = 319,
  Popfq = 320,
  Sahf = 321,
  Lahf = 322,
  Mov_AL_moffs8 = 323,
  Mov_AX_moffs16 = 324,
  Mov_EAX_moffs32 = 325,
  Mov_RAX_moffs64 = 326,
  Mov_moffs8_AL = 327,
  Mov_moffs16_AX = 328,
  Mov_moffs32_EAX = 329,
  Mov_moffs64_RAX = 330,
  Movsb_m8_m8 = 331,
  Movsw_m16_m16 = 332,
  Movsd_m32_m32 = 333,
  Movsq_m64_m64 = 334,
  Cmpsb_m8_m8 = 335,
  Cmpsw_m16_m16 = 336,
  Cmpsd_m32_m32 = 337,
  Cmpsq_m64_m64 = 338,
  Test_AL_imm8 = 339,
  Test_AX_imm16 = 340,
  Test_EAX_imm32 = 341,
  Test_RAX_imm32 = 342,
  Stosb_m8_AL = 343,
  Stosw_m16_AX = 344,
  Stosd_m32_EAX = 345,
  Stosq_m64_RAX = 346,
  Lodsb_AL_m8 = 347,
  Lodsw_AX_m16 = 348,
  Lodsd_EAX_m32 = 349,
  Lodsq_RAX_m64 = 350,
  Scasb_AL_m8 = 351,
  Scasw_AX_m16 = 352,
  Scasd_EAX_m32 = 353,
  Scasq_RAX_m64 = 354,
  Mov_r8_imm8 = 355,
  Mov_r16_imm16 = 356,
  Mov_r32_imm32 = 357,
  Mov_r64_imm64 = 358,
  Rol_rm8_imm8 = 359,
  Ror_rm8_imm8 = 360,
  Rcl_rm8_imm8 = 361,
  Rcr_rm8_imm8 = 362,
  Shl_rm8_imm8 = 363,
  Shr_rm8_imm8 = 364,
  Sal_rm8_imm8 = 365,
  Sar_rm8_imm8 = 366,
  Rol_rm16_imm8 = 367,
  Rol_rm32_imm8 = 368,
  Rol_rm64_imm8 = 369,
  Ror_rm16_imm8 = 370,
  Ror_rm32_imm8 = 371,
  Ror_rm64_imm8 = 372,
  Rcl_rm16_imm8 = 373,
  Rcl_rm32_imm8 = 374,
  Rcl_rm64_imm8 = 375,
  Rcr_rm16_imm8 = 376,
  Rcr_rm32_imm8 = 377,
  Rcr_rm64_imm8 = 378,
  Shl_rm16_imm8 = 379,
  Shl_rm32_imm8 = 380,
  Shl_rm64_imm8 = 381,
  Shr_rm16_imm8 = 382,
  Shr_rm32_imm8 = 383,
  Shr_rm64_imm8 = 384,
  Sal_rm16_imm8 = 385,
  Sal_rm32_imm8 = 386,
  Sal_rm64_imm8 = 387,
  Sar_rm16_imm8 = 388,
  Sar_rm32_imm8 = 389,
  Sar_rm64_imm8 = 390,
  Retnw_imm16 = 391,
  Retnd_imm16 = 392,
  Retnq_imm16 = 393,
  Retnw = 394,
  Retnd = 395,
  Retnq = 396,
  Les_r16_m1616 = 397,
  Les_r32_m1632 = 398,
  Lds_r16_m1616 = 399,
  Lds_r32_m1632 = 400,
  Mov_rm8_imm8 = 401,
  Xabort_imm8 = 402,
  Mov_rm16_imm16 = 403,
  Mov_rm32_imm32 = 404,
  Mov_rm64_imm32 = 405,
  Xbegin_rel16 = 406,
  Xbegin_rel32 = 407,
  Enterw_imm16_imm8 = 408,
  Enterd_imm16_imm8 = 409,
  Enterq_imm16_imm8 = 410,
  Leavew = 411,
  Leaved = 412,
  Leaveq = 413,
  Retfw_imm16 = 414,
  Retfd_imm16 = 415,
  Retfq_imm16 = 416,
  Retfw = 417,
  Retfd = 418,
  Retfq = 419,
  Int3 = 420,
  Int_imm8 = 421,
  Into = 422,
  Iretw = 423,
  Iretd = 424,
  Iretq = 425,
  Rol_rm8_1 = 426,
  Ror_rm8_1 = 427,
  Rcl_rm8_1 = 428,
  Rcr_rm8_1 = 429,
  Shl_rm8_1 = 430,
  Shr_rm8_1 = 431,
  Sal_rm8_1 = 432,
  Sar_rm8_1 = 433,
  Rol_rm16_1 = 434,
  Rol_rm32_1 = 435,
  Rol_rm64_1 = 436,
  Ror_rm16_1 = 437,
  Ror_rm32_1 = 438,
  Ror_rm64_1 = 439,
  Rcl_rm16_1 = 440,
  Rcl_rm32_1 = 441,
  Rcl_rm64_1 = 442,
  Rcr_rm16_1 = 443,
  Rcr_rm32_1 = 444,
  Rcr_rm64_1 = 445,
  Shl_rm16_1 = 446,
  Shl_rm32_1 = 447,
  Shl_rm64_1 = 448,
  Shr_rm16_1 = 449,
  Shr_rm32_1 = 450,
  Shr_rm64_1 = 451,
  Sal_rm16_1 = 452,
  Sal_rm32_1 = 453,
  Sal_rm64_1 = 454,
  Sar_rm16_1 = 455,
  Sar_rm32_1 = 456,
  Sar_rm64_1 = 457,
  Rol_rm8_CL = 458,
  Ror_rm8_CL = 459,
  Rcl_rm8_CL = 460,
  Rcr_rm8_CL = 461,
  Shl_rm8_CL = 462,
  Shr_rm8_CL = 463,
  Sal_rm8_CL = 464,
  Sar_rm8_CL = 465,
  Rol_rm16_CL = 466,
  Rol_rm32_CL = 467,
  Rol_rm64_CL = 468,
  Ror_rm16_CL = 469,
  Ror_rm32_CL = 470,
  Ror_rm64_CL = 471,
  Rcl_rm16_CL = 472,
  Rcl_rm32_CL = 473,
  Rcl_rm64_CL = 474,
  Rcr_rm16_CL = 475,
  Rcr_rm32_CL = 476,
  Rcr_rm64_CL = 477,
  Shl_rm16_CL = 478,
  Shl_rm32_CL = 479,
  Shl_rm64_CL = 480,
  Shr_rm16_CL = 481,
  Shr_rm32_CL = 482,
  Shr_rm64_CL = 483,
  Sal_rm16_CL = 484,
  Sal_rm32_CL = 485,
  Sal_rm64_CL = 486,
  Sar_rm16_CL = 487,
  Sar_rm32_CL = 488,
  Sar_rm64_CL = 489,
  Aam_imm8 = 490,
  Aad_imm8 = 491,
  Salc = 492,
  Xlat_m8 = 493,
  Fadd_m32fp = 494,
  Fmul_m32fp = 495,
  Fcom_m32fp = 496,
  Fcomp_m32fp = 497,
  Fsub_m32fp = 498,
  Fsubr_m32fp = 499,
  Fdiv_m32fp = 500,
  Fdivr_m32fp = 501,
  Fadd_st0_sti = 502,
  Fmul_st0_sti = 503,
  Fcom_st0_sti = 504,
  Fcomp_st0_sti = 505,
  Fsub_st0_sti = 506,
  Fsubr_st0_sti = 507,
  Fdiv_st0_sti = 508,
  Fdivr_st0_sti = 509,
  Fld_m32fp = 510,
  Fst_m32fp = 511,
  Fstp_m32fp = 512,
  Fldenv_m14byte = 513,
  Fldenv_m28byte = 514,
  Fldcw_m2byte = 515,
  Fnstenv_m14byte = 516,
  Fstenv_m14byte = 517,
  Fnstenv_m28byte = 518,
  Fstenv_m28byte = 519,
  Fnstcw_m2byte = 520,
  Fstcw_m2byte = 521,
  Fld_sti = 522,
  Fxch_st0_sti = 523,
  Fnop = 524,
  Fstpnce_sti = 525,
  Fchs = 526,
  Fabs = 527,
  Ftst = 528,
  Fxam = 529,
  Fld1 = 530,
  Fldl2t = 531,
  Fldl2e = 532,
  Fldpi = 533,
  Fldlg2 = 534,
  Fldln2 = 535,
  Fldz = 536,
  F2xm1 = 537,
  Fyl2x = 538,
  Fptan = 539,
  Fpatan = 540,
  Fxtract = 541,
  Fprem1 = 542,
  Fdecstp = 543,
  Fincstp = 544,
  Fprem = 545,
  Fyl2xp1 = 546,
  Fsqrt = 547,
  Fsincos = 548,
  Frndint = 549,
  Fscale = 550,
  Fsin = 551,
  Fcos = 552,
  Fiadd_m32int = 553,
  Fimul_m32int = 554,
  Ficom_m32int = 555,
  Ficomp_m32int = 556,
  Fisub_m32int = 557,
  Fisubr_m32int = 558,
  Fidiv_m32int = 559,
  Fidivr_m32int = 560,
  Fcmovb_st0_sti = 561,
  Fcmove_st0_sti = 562,
  Fcmovbe_st0_sti = 563,
  Fcmovu_st0_sti = 564,
  Fucompp = 565,
  Fild_m32int = 566,
  Fisttp_m32int = 567,
  Fist_m32int = 568,
  Fistp_m32int = 569,
  Fld_m80fp = 570,
  Fstp_m80fp = 571,
  Fcmovnb_st0_sti = 572,
  Fcmovne_st0_sti = 573,
  Fcmovnbe_st0_sti = 574,
  Fcmovnu_st0_sti = 575,
  Fneni = 576,
  Feni = 577,
  Fndisi = 578,
  Fdisi = 579,
  Fnclex = 580,
  Fclex = 581,
  Fninit = 582,
  Finit = 583,
  Fnsetpm = 584,
  Fsetpm = 585,
  Frstpm = 586,
  Fucomi_st0_sti = 587,
  Fcomi_st0_sti = 588,
  Fadd_m64fp = 589,
  Fmul_m64fp = 590,
  Fcom_m64fp = 591,
  Fcomp_m64fp = 592,
  Fsub_m64fp = 593,
  Fsubr_m64fp = 594,
  Fdiv_m64fp = 595,
  Fdivr_m64fp = 596,
  Fadd_sti_st0 = 597,
  Fmul_sti_st0 = 598,
  Fcom_st0_sti_DCD0 = 599,
  Fcomp_st0_sti_DCD8 = 600,
  Fsubr_sti_st0 = 601,
  Fsub_sti_st0 = 602,
  Fdivr_sti_st0 = 603,
  Fdiv_sti_st0 = 604,
  Fld_m64fp = 605,
  Fisttp_m64int = 606,
  Fst_m64fp = 607,
  Fstp_m64fp = 608,
  Frstor_m94byte = 609,
  Frstor_m108byte = 610,
  Fnsave_m94byte = 611,
  Fsave_m94byte = 612,
  Fnsave_m108byte = 613,
  Fsave_m108byte = 614,
  Fnstsw_m2byte = 615,
  Fstsw_m2byte = 616,
  Ffree_sti = 617,
  Fxch_st0_sti_DDC8 = 618,
  Fst_sti = 619,
  Fstp_sti = 620,
  Fucom_st0_sti = 621,
  Fucomp_st0_sti = 622,
  Fiadd_m16int = 623,
  Fimul_m16int = 624,
  Ficom_m16int = 625,
  Ficomp_m16int = 626,
  Fisub_m16int = 627,
  Fisubr_m16int = 628,
  Fidiv_m16int = 629,
  Fidivr_m16int = 630,
  Faddp_sti_st0 = 631,
  Fmulp_sti_st0 = 632,
  Fcomp_st0_sti_DED0 = 633,
  Fcompp = 634,
  Fsubrp_sti_st0 = 635,
  Fsubp_sti_st0 = 636,
  Fdivrp_sti_st0 = 637,
  Fdivp_sti_st0 = 638,
  Fild_m16int = 639,
  Fisttp_m16int = 640,
  Fist_m16int = 641,
  Fistp_m16int = 642,
  Fbld_m80bcd = 643,
  Fild_m64int = 644,
  Fbstp_m80bcd = 645,
  Fistp_m64int = 646,
  Ffreep_sti = 647,
  Fxch_st0_sti_DFC8 = 648,
  Fstp_sti_DFD0 = 649,
  Fstp_sti_DFD8 = 650,
  Fnstsw_AX = 651,
  Fstsw_AX = 652,
  Fstdw_AX = 653,
  Fstsg_AX = 654,
  Fucomip_st0_sti = 655,
  Fcomip_st0_sti = 656,
  Loopne_rel8_16_CX = 657,
  Loopne_rel8_32_CX = 658,
  Loopne_rel8_16_ECX = 659,
  Loopne_rel8_32_ECX = 660,
  Loopne_rel8_64_ECX = 661,
  Loopne_rel8_16_RCX = 662,
  Loopne_rel8_64_RCX = 663,
  Loope_rel8_16_CX = 664,
  Loope_rel8_32_CX = 665,
  Loope_rel8_16_ECX = 666,
  Loope_rel8_32_ECX = 667,
  Loope_rel8_64_ECX = 668,
  Loope_rel8_16_RCX = 669,
  Loope_rel8_64_RCX = 670,
  Loop_rel8_16_CX = 671,
  Loop_rel8_32_CX = 672,
  Loop_rel8_16_ECX = 673,
  Loop_rel8_32_ECX = 674,
  Loop_rel8_64_ECX = 675,
  Loop_rel8_16_RCX = 676,
  Loop_rel8_64_RCX = 677,
  Jcxz_rel8_16 = 678,
  Jcxz_rel8_32 = 679,
  Jecxz_rel8_16 = 680,
  Jecxz_rel8_32 = 681,
  Jecxz_rel8_64 = 682,
  Jrcxz_rel8_16 = 683,
  Jrcxz_rel8_64 = 684,
  In_AL_imm8 = 685,
  In_AX_imm8 = 686,
  In_EAX_imm8 = 687,
  Out_imm8_AL = 688,
  Out_imm8_AX = 689,
  Out_imm8_EAX = 690,
  Call_rel16 = 691,
  Call_rel32_32 = 692,
  Call_rel32_64 = 693,
  Jmp_rel16 = 694,
  Jmp_rel32_32 = 695,
  Jmp_rel32_64 = 696,
  Jmp_ptr1616 = 697,
  Jmp_ptr1632 = 698,
  Jmp_rel8_16 = 699,
  Jmp_rel8_32 = 700,
  Jmp_rel8_64 = 701,
  In_AL_DX = 702,
  In_AX_DX = 703,
  In_EAX_DX = 704,
  Out_DX_AL = 705,
  Out_DX_AX = 706,
  Out_DX_EAX = 707,
  Int1 = 708,
  Hlt = 709,
  Cmc = 710,
  Test_rm8_imm8 = 711,
  Test_rm8_imm8_F6r1 = 712,
  Not_rm8 = 713,
  Neg_rm8 = 714,
  Mul_rm8 = 715,
  Imul_rm8 = 716,
  Div_rm8 = 717,
  Idiv_rm8 = 718,
  Test_rm16_imm16 = 719,
  Test_rm32_imm32 = 720,
  Test_rm64_imm32 = 721,
  Test_rm16_imm16_F7r1 = 722,
  Test_rm32_imm32_F7r1 = 723,
  Test_rm64_imm32_F7r1 = 724,
  Not_rm16 = 725,
  Not_rm32 = 726,
  Not_rm64 = 727,
  Neg_rm16 = 728,
  Neg_rm32 = 729,
  Neg_rm64 = 730,
  Mul_rm16 = 731,
  Mul_rm32 = 732,
  Mul_rm64 = 733,
  Imul_rm16 = 734,
  Imul_rm32 = 735,
  Imul_rm64 = 736,
  Div_rm16 = 737,
  Div_rm32 = 738,
  Div_rm64 = 739,
  Idiv_rm16 = 740,
  Idiv_rm32 = 741,
  Idiv_rm64 = 742,
  Clc = 743,
  Stc = 744,
  Cli = 745,
  Sti = 746,
  Cld = 747,
  Std = 748,
  Inc_rm8 = 749,
  Dec_rm8 = 750,
  Inc_rm16 = 751,
  Inc_rm32 = 752,
  Inc_rm64 = 753,
  Dec_rm16 = 754,
  Dec_rm32 = 755,
  Dec_rm64 = 756,
  Call_rm16 = 757,
  Call_rm32 = 758,
  Call_rm64 = 759,
  Call_m1616 = 760,
  Call_m1632 = 761,
  Call_m1664 = 762,
  Jmp_rm16 = 763,
  Jmp_rm32 = 764,
  Jmp_rm64 = 765,
  Jmp_m1616 = 766,
  Jmp_m1632 = 767,
  Jmp_m1664 = 768,
  Push_rm16 = 769,
  Push_rm32 = 770,
  Push_rm64 = 771,
  Sldt_rm16 = 772,
  Sldt_r32m16 = 773,
  Sldt_r64m16 = 774,
  Str_rm16 = 775,
  Str_r32m16 = 776,
  Str_r64m16 = 777,
  Lldt_rm16 = 778,
  Lldt_r32m16 = 779,
  Lldt_r64m16 = 780,
  Ltr_rm16 = 781,
  Ltr_r32m16 = 782,
  Ltr_r64m16 = 783,
  Verr_rm16 = 784,
  Verr_r32m16 = 785,
  Verr_r64m16 = 786,
  Verw_rm16 = 787,
  Verw_r32m16 = 788,
  Verw_r64m16 = 789,
  Jmpe_rm16 = 790,
  Jmpe_rm32 = 791,
  Sgdt_m1632_16 = 792,
  Sgdt_m1632 = 793,
  Sgdt_m1664 = 794,
  Sidt_m1632_16 = 795,
  Sidt_m1632 = 796,
  Sidt_m1664 = 797,
  Lgdt_m1632_16 = 798,
  Lgdt_m1632 = 799,
  Lgdt_m1664 = 800,
  Lidt_m1632_16 = 801,
  Lidt_m1632 = 802,
  Lidt_m1664 = 803,
  Smsw_rm16 = 804,
  Smsw_r32m16 = 805,
  Smsw_r64m16 = 806,
  Rstorssp_m64 = 807,
  Lmsw_rm16 = 808,
  Lmsw_r32m16 = 809,
  Lmsw_r64m16 = 810,
  Invlpg_m = 811,
  Enclv = 812,
  Vmcall = 813,
  Vmlaunch = 814,
  Vmresume = 815,
  Vmxoff = 816,
  Pconfig = 817,
  Monitorw = 818,
  Monitord = 819,
  Monitorq = 820,
  Mwait = 821,
  Clac = 822,
  Stac = 823,
  Encls = 824,
  Xgetbv = 825,
  Xsetbv = 826,
  Vmfunc = 827,
  Xend = 828,
  Xtest = 829,
  Enclu = 830,
  Vmrunw = 831,
  Vmrund = 832,
  Vmrunq = 833,
  Vmmcall = 834,
  Vmloadw = 835,
  Vmloadd = 836,
  Vmloadq = 837,
  Vmsavew = 838,
  Vmsaved = 839,
  Vmsaveq = 840,
  Stgi = 841,
  Clgi = 842,
  Skinit = 843,
  Invlpgaw = 844,
  Invlpgad = 845,
  Invlpgaq = 846,
  Setssbsy = 847,
  Saveprevssp = 848,
  Rdpkru = 849,
  Wrpkru = 850,
  Swapgs = 851,
  Rdtscp = 852,
  Monitorxw = 853,
  Monitorxd = 854,
  Monitorxq = 855,
  Mcommit = 856,
  Mwaitx = 857,
  Clzerow = 858,
  Clzerod = 859,
  Clzeroq = 860,
  Rdpru = 861,
  Lar_r16_rm16 = 862,
  Lar_r32_r32m16 = 863,
  Lar_r64_r64m16 = 864,
  Lsl_r16_rm16 = 865,
  Lsl_r32_r32m16 = 866,
  Lsl_r64_r64m16 = 867,
  Storeall = 868,
  Loadall286 = 869,
  Syscall = 870,
  Clts = 871,
  Loadall386 = 872,
  Sysretd = 873,
  Sysretq = 874,
  Invd = 875,
  Wbinvd = 876,
  Wbnoinvd = 877,
  Cl1invmb = 878,
  Ud2 = 879,
  Reservednop_rm16_r16_0F0D = 880,
  Reservednop_rm32_r32_0F0D = 881,
  Reservednop_rm64_r64_0F0D = 882,
  Prefetch_m8 = 883,
  Prefetchw_m8 = 884,
  Prefetchwt1_m8 = 885,
  Femms = 886,
  Umov_rm8_r8 = 887,
  Umov_rm16_r16 = 888,
  Umov_rm32_r32 = 889,
  Umov_r8_rm8 = 890,
  Umov_r16_rm16 = 891,
  Umov_r32_rm32 = 892,
  Movups_xmm_xmmm128 = 893,
  VEX_Vmovups_xmm_xmmm128 = 894,
  VEX_Vmovups_ymm_ymmm256 = 895,
  EVEX_Vmovups_xmm_k1z_xmmm128 = 896,
  EVEX_Vmovups_ymm_k1z_ymmm256 = 897,
  EVEX_Vmovups_zmm_k1z_zmmm512 = 898,
  Movupd_xmm_xmmm128 = 899,
  VEX_Vmovupd_xmm_xmmm128 = 900,
  VEX_Vmovupd_ymm_ymmm256 = 901,
  EVEX_Vmovupd_xmm_k1z_xmmm128 = 902,
  EVEX_Vmovupd_ymm_k1z_ymmm256 = 903,
  EVEX_Vmovupd_zmm_k1z_zmmm512 = 904,
  Movss_xmm_xmmm32 = 905,
  VEX_Vmovss_xmm_xmm_xmm = 906,
  VEX_Vmovss_xmm_m32 = 907,
  EVEX_Vmovss_xmm_k1z_xmm_xmm = 908,
  EVEX_Vmovss_xmm_k1z_m32 = 909,
  Movsd_xmm_xmmm64 = 910,
  VEX_Vmovsd_xmm_xmm_xmm = 911,
  VEX_Vmovsd_xmm_m64 = 912,
  EVEX_Vmovsd_xmm_k1z_xmm_xmm = 913,
  EVEX_Vmovsd_xmm_k1z_m64 = 914,
  Movups_xmmm128_xmm = 915,
  VEX_Vmovups_xmmm128_xmm = 916,
  VEX_Vmovups_ymmm256_ymm = 917,
  EVEX_Vmovups_xmmm128_k1z_xmm = 918,
  EVEX_Vmovups_ymmm256_k1z_ymm = 919,
  EVEX_Vmovups_zmmm512_k1z_zmm = 920,
  Movupd_xmmm128_xmm = 921,
  VEX_Vmovupd_xmmm128_xmm = 922,
  VEX_Vmovupd_ymmm256_ymm = 923,
  EVEX_Vmovupd_xmmm128_k1z_xmm = 924,
  EVEX_Vmovupd_ymmm256_k1z_ymm = 925,
  EVEX_Vmovupd_zmmm512_k1z_zmm = 926,
  Movss_xmmm32_xmm = 927,
  VEX_Vmovss_xmm_xmm_xmm_0F11 = 928,
  VEX_Vmovss_m32_xmm = 929,
  EVEX_Vmovss_xmm_k1z_xmm_xmm_0F11 = 930,
  EVEX_Vmovss_m32_k1_xmm = 931,
  Movsd_xmmm64_xmm = 932,
  VEX_Vmovsd_xmm_xmm_xmm_0F11 = 933,
  VEX_Vmovsd_m64_xmm = 934,
  EVEX_Vmovsd_xmm_k1z_xmm_xmm_0F11 = 935,
  EVEX_Vmovsd_m64_k1_xmm = 936,
  Movhlps_xmm_xmm = 937,
  Movlps_xmm_m64 = 938,
  VEX_Vmovhlps_xmm_xmm_xmm = 939,
  VEX_Vmovlps_xmm_xmm_m64 = 940,
  EVEX_Vmovhlps_xmm_xmm_xmm = 941,
  EVEX_Vmovlps_xmm_xmm_m64 = 942,
  Movlpd_xmm_m64 = 943,
  VEX_Vmovlpd_xmm_xmm_m64 = 944,
  EVEX_Vmovlpd_xmm_xmm_m64 = 945,
  Movsldup_xmm_xmmm128 = 946,
  VEX_Vmovsldup_xmm_xmmm128 = 947,
  VEX_Vmovsldup_ymm_ymmm256 = 948,
  EVEX_Vmovsldup_xmm_k1z_xmmm128 = 949,
  EVEX_Vmovsldup_ymm_k1z_ymmm256 = 950,
  EVEX_Vmovsldup_zmm_k1z_zmmm512 = 951,
  Movddup_xmm_xmmm64 = 952,
  VEX_Vmovddup_xmm_xmmm64 = 953,
  VEX_Vmovddup_ymm_ymmm256 = 954,
  EVEX_Vmovddup_xmm_k1z_xmmm64 = 955,
  EVEX_Vmovddup_ymm_k1z_ymmm256 = 956,
  EVEX_Vmovddup_zmm_k1z_zmmm512 = 957,
  Movlps_m64_xmm = 958,
  VEX_Vmovlps_m64_xmm = 959,
  EVEX_Vmovlps_m64_xmm = 960,
  Movlpd_m64_xmm = 961,
  VEX_Vmovlpd_m64_xmm = 962,
  EVEX_Vmovlpd_m64_xmm = 963,
  Unpcklps_xmm_xmmm128 = 964,
  VEX_Vunpcklps_xmm_xmm_xmmm128 = 965,
  VEX_Vunpcklps_ymm_ymm_ymmm256 = 966,
  EVEX_Vunpcklps_xmm_k1z_xmm_xmmm128b32 = 967,
  EVEX_Vunpcklps_ymm_k1z_ymm_ymmm256b32 = 968,
  EVEX_Vunpcklps_zmm_k1z_zmm_zmmm512b32 = 969,
  Unpcklpd_xmm_xmmm128 = 970,
  VEX_Vunpcklpd_xmm_xmm_xmmm128 = 971,
  VEX_Vunpcklpd_ymm_ymm_ymmm256 = 972,
  EVEX_Vunpcklpd_xmm_k1z_xmm_xmmm128b64 = 973,
  EVEX_Vunpcklpd_ymm_k1z_ymm_ymmm256b64 = 974,
  EVEX_Vunpcklpd_zmm_k1z_zmm_zmmm512b64 = 975,
  Unpckhps_xmm_xmmm128 = 976,
  VEX_Vunpckhps_xmm_xmm_xmmm128 = 977,
  VEX_Vunpckhps_ymm_ymm_ymmm256 = 978,
  EVEX_Vunpckhps_xmm_k1z_xmm_xmmm128b32 = 979,
  EVEX_Vunpckhps_ymm_k1z_ymm_ymmm256b32 = 980,
  EVEX_Vunpckhps_zmm_k1z_zmm_zmmm512b32 = 981,
  Unpckhpd_xmm_xmmm128 = 982,
  VEX_Vunpckhpd_xmm_xmm_xmmm128 = 983,
  VEX_Vunpckhpd_ymm_ymm_ymmm256 = 984,
  EVEX_Vunpckhpd_xmm_k1z_xmm_xmmm128b64 = 985,
  EVEX_Vunpckhpd_ymm_k1z_ymm_ymmm256b64 = 986,
  EVEX_Vunpckhpd_zmm_k1z_zmm_zmmm512b64 = 987,
  Movlhps_xmm_xmm = 988,
  VEX_Vmovlhps_xmm_xmm_xmm = 989,
  EVEX_Vmovlhps_xmm_xmm_xmm = 990,
  Movhps_xmm_m64 = 991,
  VEX_Vmovhps_xmm_xmm_m64 = 992,
  EVEX_Vmovhps_xmm_xmm_m64 = 993,
  Movhpd_xmm_m64 = 994,
  VEX_Vmovhpd_xmm_xmm_m64 = 995,
  EVEX_Vmovhpd_xmm_xmm_m64 = 996,
  Movshdup_xmm_xmmm128 = 997,
  VEX_Vmovshdup_xmm_xmmm128 = 998,
  VEX_Vmovshdup_ymm_ymmm256 = 999,
  EVEX_Vmovshdup_xmm_k1z_xmmm128 = 1000,
  EVEX_Vmovshdup_ymm_k1z_ymmm256 = 1001,
  EVEX_Vmovshdup_zmm_k1z_zmmm512 = 1002,
  Movhps_m64_xmm = 1003,
  VEX_Vmovhps_m64_xmm = 1004,
  EVEX_Vmovhps_m64_xmm = 1005,
  Movhpd_m64_xmm = 1006,
  VEX_Vmovhpd_m64_xmm = 1007,
  EVEX_Vmovhpd_m64_xmm = 1008,
  Reservednop_rm16_r16_0F18 = 1009,
  Reservednop_rm32_r32_0F18 = 1010,
  Reservednop_rm64_r64_0F18 = 1011,
  Reservednop_rm16_r16_0F19 = 1012,
  Reservednop_rm32_r32_0F19 = 1013,
  Reservednop_rm64_r64_0F19 = 1014,
  Reservednop_rm16_r16_0F1A = 1015,
  Reservednop_rm32_r32_0F1A = 1016,
  Reservednop_rm64_r64_0F1A = 1017,
  Reservednop_rm16_r16_0F1B = 1018,
  Reservednop_rm32_r32_0F1B = 1019,
  Reservednop_rm64_r64_0F1B = 1020,
  Reservednop_rm16_r16_0F1C = 1021,
  Reservednop_rm32_r32_0F1C = 1022,
  Reservednop_rm64_r64_0F1C = 1023,
  Reservednop_rm16_r16_0F1D = 1024,
  Reservednop_rm32_r32_0F1D = 1025,
  Reservednop_rm64_r64_0F1D = 1026,
  Reservednop_rm16_r16_0F1E = 1027,
  Reservednop_rm32_r32_0F1E = 1028,
  Reservednop_rm64_r64_0F1E = 1029,
  Reservednop_rm16_r16_0F1F = 1030,
  Reservednop_rm32_r32_0F1F = 1031,
  Reservednop_rm64_r64_0F1F = 1032,
  Prefetchnta_m8 = 1033,
  Prefetcht0_m8 = 1034,
  Prefetcht1_m8 = 1035,
  Prefetcht2_m8 = 1036,
  Bndldx_bnd_mib = 1037,
  Bndmov_bnd_bndm64 = 1038,
  Bndmov_bnd_bndm128 = 1039,
  Bndcl_bnd_rm32 = 1040,
  Bndcl_bnd_rm64 = 1041,
  Bndcu_bnd_rm32 = 1042,
  Bndcu_bnd_rm64 = 1043,
  Bndstx_mib_bnd = 1044,
  Bndmov_bndm64_bnd = 1045,
  Bndmov_bndm128_bnd = 1046,
  Bndmk_bnd_m32 = 1047,
  Bndmk_bnd_m64 = 1048,
  Bndcn_bnd_rm32 = 1049,
  Bndcn_bnd_rm64 = 1050,
  Cldemote_m8 = 1051,
  Rdsspd_r32 = 1052,
  Rdsspq_r64 = 1053,
  Endbr64 = 1054,
  Endbr32 = 1055,
  Nop_rm16 = 1056,
  Nop_rm32 = 1057,
  Nop_rm64 = 1058,
  Mov_r32_cr = 1059,
  Mov_r64_cr = 1060,
  Mov_r32_dr = 1061,
  Mov_r64_dr = 1062,
  Mov_cr_r32 = 1063,
  Mov_cr_r64 = 1064,
  Mov_dr_r32 = 1065,
  Mov_dr_r64 = 1066,
  Mov_r32_tr = 1067,
  Mov_tr_r32 = 1068,
  Movaps_xmm_xmmm128 = 1069,
  VEX_Vmovaps_xmm_xmmm128 = 1070,
  VEX_Vmovaps_ymm_ymmm256 = 1071,
  EVEX_Vmovaps_xmm_k1z_xmmm128 = 1072,
  EVEX_Vmovaps_ymm_k1z_ymmm256 = 1073,
  EVEX_Vmovaps_zmm_k1z_zmmm512 = 1074,
  Movapd_xmm_xmmm128 = 1075,
  VEX_Vmovapd_xmm_xmmm128 = 1076,
  VEX_Vmovapd_ymm_ymmm256 = 1077,
  EVEX_Vmovapd_xmm_k1z_xmmm128 = 1078,
  EVEX_Vmovapd_ymm_k1z_ymmm256 = 1079,
  EVEX_Vmovapd_zmm_k1z_zmmm512 = 1080,
  Movaps_xmmm128_xmm = 1081,
  VEX_Vmovaps_xmmm128_xmm = 1082,
  VEX_Vmovaps_ymmm256_ymm = 1083,
  EVEX_Vmovaps_xmmm128_k1z_xmm = 1084,
  EVEX_Vmovaps_ymmm256_k1z_ymm = 1085,
  EVEX_Vmovaps_zmmm512_k1z_zmm = 1086,
  Movapd_xmmm128_xmm = 1087,
  VEX_Vmovapd_xmmm128_xmm = 1088,
  VEX_Vmovapd_ymmm256_ymm = 1089,
  EVEX_Vmovapd_xmmm128_k1z_xmm = 1090,
  EVEX_Vmovapd_ymmm256_k1z_ymm = 1091,
  EVEX_Vmovapd_zmmm512_k1z_zmm = 1092,
  Cvtpi2ps_xmm_mmm64 = 1093,
  Cvtpi2pd_xmm_mmm64 = 1094,
  Cvtsi2ss_xmm_rm32 = 1095,
  Cvtsi2ss_xmm_rm64 = 1096,
  VEX_Vcvtsi2ss_xmm_xmm_rm32 = 1097,
  VEX_Vcvtsi2ss_xmm_xmm_rm64 = 1098,
  EVEX_Vcvtsi2ss_xmm_xmm_rm32_er = 1099,
  EVEX_Vcvtsi2ss_xmm_xmm_rm64_er = 1100,
  Cvtsi2sd_xmm_rm32 = 1101,
  Cvtsi2sd_xmm_rm64 = 1102,
  VEX_Vcvtsi2sd_xmm_xmm_rm32 = 1103,
  VEX_Vcvtsi2sd_xmm_xmm_rm64 = 1104,
  EVEX_Vcvtsi2sd_xmm_xmm_rm32_er = 1105,
  EVEX_Vcvtsi2sd_xmm_xmm_rm64_er = 1106,
  Movntps_m128_xmm = 1107,
  VEX_Vmovntps_m128_xmm = 1108,
  VEX_Vmovntps_m256_ymm = 1109,
  EVEX_Vmovntps_m128_xmm = 1110,
  EVEX_Vmovntps_m256_ymm = 1111,
  EVEX_Vmovntps_m512_zmm = 1112,
  Movntpd_m128_xmm = 1113,
  VEX_Vmovntpd_m128_xmm = 1114,
  VEX_Vmovntpd_m256_ymm = 1115,
  EVEX_Vmovntpd_m128_xmm = 1116,
  EVEX_Vmovntpd_m256_ymm = 1117,
  EVEX_Vmovntpd_m512_zmm = 1118,
  Movntss_m32_xmm = 1119,
  Movntsd_m64_xmm = 1120,
  Cvttps2pi_mm_xmmm64 = 1121,
  Cvttpd2pi_mm_xmmm128 = 1122,
  Cvttss2si_r32_xmmm32 = 1123,
  Cvttss2si_r64_xmmm32 = 1124,
  VEX_Vcvttss2si_r32_xmmm32 = 1125,
  VEX_Vcvttss2si_r64_xmmm32 = 1126,
  EVEX_Vcvttss2si_r32_xmmm32_sae = 1127,
  EVEX_Vcvttss2si_r64_xmmm32_sae = 1128,
  Cvttsd2si_r32_xmmm64 = 1129,
  Cvttsd2si_r64_xmmm64 = 1130,
  VEX_Vcvttsd2si_r32_xmmm64 = 1131,
  VEX_Vcvttsd2si_r64_xmmm64 = 1132,
  EVEX_Vcvttsd2si_r32_xmmm64_sae = 1133,
  EVEX_Vcvttsd2si_r64_xmmm64_sae = 1134,
  Cvtps2pi_mm_xmmm64 = 1135,
  Cvtpd2pi_mm_xmmm128 = 1136,
  Cvtss2si_r32_xmmm32 = 1137,
  Cvtss2si_r64_xmmm32 = 1138,
  VEX_Vcvtss2si_r32_xmmm32 = 1139,
  VEX_Vcvtss2si_r64_xmmm32 = 1140,
  EVEX_Vcvtss2si_r32_xmmm32_er = 1141,
  EVEX_Vcvtss2si_r64_xmmm32_er = 1142,
  Cvtsd2si_r32_xmmm64 = 1143,
  Cvtsd2si_r64_xmmm64 = 1144,
  VEX_Vcvtsd2si_r32_xmmm64 = 1145,
  VEX_Vcvtsd2si_r64_xmmm64 = 1146,
  EVEX_Vcvtsd2si_r32_xmmm64_er = 1147,
  EVEX_Vcvtsd2si_r64_xmmm64_er = 1148,
  Ucomiss_xmm_xmmm32 = 1149,
  VEX_Vucomiss_xmm_xmmm32 = 1150,
  EVEX_Vucomiss_xmm_xmmm32_sae = 1151,
  Ucomisd_xmm_xmmm64 = 1152,
  VEX_Vucomisd_xmm_xmmm64 = 1153,
  EVEX_Vucomisd_xmm_xmmm64_sae = 1154,
  Comiss_xmm_xmmm32 = 1155,
  Comisd_xmm_xmmm64 = 1156,
  VEX_Vcomiss_xmm_xmmm32 = 1157,
  VEX_Vcomisd_xmm_xmmm64 = 1158,
  EVEX_Vcomiss_xmm_xmmm32_sae = 1159,
  EVEX_Vcomisd_xmm_xmmm64_sae = 1160,
  Wrmsr = 1161,
  Rdtsc = 1162,
  Rdmsr = 1163,
  Rdpmc = 1164,
  Sysenter = 1165,
  Sysexitd = 1166,
  Sysexitq = 1167,
  Getsecd = 1168,
  Cmovo_r16_rm16 = 1169,
  Cmovo_r32_rm32 = 1170,
  Cmovo_r64_rm64 = 1171,
  Cmovno_r16_rm16 = 1172,
  Cmovno_r32_rm32 = 1173,
  Cmovno_r64_rm64 = 1174,
  Cmovb_r16_rm16 = 1175,
  Cmovb_r32_rm32 = 1176,
  Cmovb_r64_rm64 = 1177,
  Cmovae_r16_rm16 = 1178,
  Cmovae_r32_rm32 = 1179,
  Cmovae_r64_rm64 = 1180,
  Cmove_r16_rm16 = 1181,
  Cmove_r32_rm32 = 1182,
  Cmove_r64_rm64 = 1183,
  Cmovne_r16_rm16 = 1184,
  Cmovne_r32_rm32 = 1185,
  Cmovne_r64_rm64 = 1186,
  Cmovbe_r16_rm16 = 1187,
  Cmovbe_r32_rm32 = 1188,
  Cmovbe_r64_rm64 = 1189,
  Cmova_r16_rm16 = 1190,
  Cmova_r32_rm32 = 1191,
  Cmova_r64_rm64 = 1192,
  Cmovs_r16_rm16 = 1193,
  Cmovs_r32_rm32 = 1194,
  Cmovs_r64_rm64 = 1195,
  Cmovns_r16_rm16 = 1196,
  Cmovns_r32_rm32 = 1197,
  Cmovns_r64_rm64 = 1198,
  Cmovp_r16_rm16 = 1199,
  Cmovp_r32_rm32 = 1200,
  Cmovp_r64_rm64 = 1201,
  Cmovnp_r16_rm16 = 1202,
  Cmovnp_r32_rm32 = 1203,
  Cmovnp_r64_rm64 = 1204,
  Cmovl_r16_rm16 = 1205,
  Cmovl_r32_rm32 = 1206,
  Cmovl_r64_rm64 = 1207,
  Cmovge_r16_rm16 = 1208,
  Cmovge_r32_rm32 = 1209,
  Cmovge_r64_rm64 = 1210,
  Cmovle_r16_rm16 = 1211,
  Cmovle_r32_rm32 = 1212,
  Cmovle_r64_rm64 = 1213,
  Cmovg_r16_rm16 = 1214,
  Cmovg_r32_rm32 = 1215,
  Cmovg_r64_rm64 = 1216,
  VEX_Kandw_kr_kr_kr = 1217,
  VEX_Kandq_kr_kr_kr = 1218,
  VEX_Kandb_kr_kr_kr = 1219,
  VEX_Kandd_kr_kr_kr = 1220,
  VEX_Kandnw_kr_kr_kr = 1221,
  VEX_Kandnq_kr_kr_kr = 1222,
  VEX_Kandnb_kr_kr_kr = 1223,
  VEX_Kandnd_kr_kr_kr = 1224,
  VEX_Knotw_kr_kr = 1225,
  VEX_Knotq_kr_kr = 1226,
  VEX_Knotb_kr_kr = 1227,
  VEX_Knotd_kr_kr = 1228,
  VEX_Korw_kr_kr_kr = 1229,
  VEX_Korq_kr_kr_kr = 1230,
  VEX_Korb_kr_kr_kr = 1231,
  VEX_Kord_kr_kr_kr = 1232,
  VEX_Kxnorw_kr_kr_kr = 1233,
  VEX_Kxnorq_kr_kr_kr = 1234,
  VEX_Kxnorb_kr_kr_kr = 1235,
  VEX_Kxnord_kr_kr_kr = 1236,
  VEX_Kxorw_kr_kr_kr = 1237,
  VEX_Kxorq_kr_kr_kr = 1238,
  VEX_Kxorb_kr_kr_kr = 1239,
  VEX_Kxord_kr_kr_kr = 1240,
  VEX_Kaddw_kr_kr_kr = 1241,
  VEX_Kaddq_kr_kr_kr = 1242,
  VEX_Kaddb_kr_kr_kr = 1243,
  VEX_Kaddd_kr_kr_kr = 1244,
  VEX_Kunpckwd_kr_kr_kr = 1245,
  VEX_Kunpckdq_kr_kr_kr = 1246,
  VEX_Kunpckbw_kr_kr_kr = 1247,
  Movmskps_r32_xmm = 1248,
  Movmskps_r64_xmm = 1249,
  VEX_Vmovmskps_r32_xmm = 1250,
  VEX_Vmovmskps_r64_xmm = 1251,
  VEX_Vmovmskps_r32_ymm = 1252,
  VEX_Vmovmskps_r64_ymm = 1253,
  Movmskpd_r32_xmm = 1254,
  Movmskpd_r64_xmm = 1255,
  VEX_Vmovmskpd_r32_xmm = 1256,
  VEX_Vmovmskpd_r64_xmm = 1257,
  VEX_Vmovmskpd_r32_ymm = 1258,
  VEX_Vmovmskpd_r64_ymm = 1259,
  Sqrtps_xmm_xmmm128 = 1260,
  VEX_Vsqrtps_xmm_xmmm128 = 1261,
  VEX_Vsqrtps_ymm_ymmm256 = 1262,
  EVEX_Vsqrtps_xmm_k1z_xmmm128b32 = 1263,
  EVEX_Vsqrtps_ymm_k1z_ymmm256b32 = 1264,
  EVEX_Vsqrtps_zmm_k1z_zmmm512b32_er = 1265,
  Sqrtpd_xmm_xmmm128 = 1266,
  VEX_Vsqrtpd_xmm_xmmm128 = 1267,
  VEX_Vsqrtpd_ymm_ymmm256 = 1268,
  EVEX_Vsqrtpd_xmm_k1z_xmmm128b64 = 1269,
  EVEX_Vsqrtpd_ymm_k1z_ymmm256b64 = 1270,
  EVEX_Vsqrtpd_zmm_k1z_zmmm512b64_er = 1271,
  Sqrtss_xmm_xmmm32 = 1272,
  VEX_Vsqrtss_xmm_xmm_xmmm32 = 1273,
  EVEX_Vsqrtss_xmm_k1z_xmm_xmmm32_er = 1274,
  Sqrtsd_xmm_xmmm64 = 1275,
  VEX_Vsqrtsd_xmm_xmm_xmmm64 = 1276,
  EVEX_Vsqrtsd_xmm_k1z_xmm_xmmm64_er = 1277,
  Rsqrtps_xmm_xmmm128 = 1278,
  VEX_Vrsqrtps_xmm_xmmm128 = 1279,
  VEX_Vrsqrtps_ymm_ymmm256 = 1280,
  Rsqrtss_xmm_xmmm32 = 1281,
  VEX_Vrsqrtss_xmm_xmm_xmmm32 = 1282,
  Rcpps_xmm_xmmm128 = 1283,
  VEX_Vrcpps_xmm_xmmm128 = 1284,
  VEX_Vrcpps_ymm_ymmm256 = 1285,
  Rcpss_xmm_xmmm32 = 1286,
  VEX_Vrcpss_xmm_xmm_xmmm32 = 1287,
  Andps_xmm_xmmm128 = 1288,
  VEX_Vandps_xmm_xmm_xmmm128 = 1289,
  VEX_Vandps_ymm_ymm_ymmm256 = 1290,
  EVEX_Vandps_xmm_k1z_xmm_xmmm128b32 = 1291,
  EVEX_Vandps_ymm_k1z_ymm_ymmm256b32 = 1292,
  EVEX_Vandps_zmm_k1z_zmm_zmmm512b32 = 1293,
  Andpd_xmm_xmmm128 = 1294,
  VEX_Vandpd_xmm_xmm_xmmm128 = 1295,
  VEX_Vandpd_ymm_ymm_ymmm256 = 1296,
  EVEX_Vandpd_xmm_k1z_xmm_xmmm128b64 = 1297,
  EVEX_Vandpd_ymm_k1z_ymm_ymmm256b64 = 1298,
  EVEX_Vandpd_zmm_k1z_zmm_zmmm512b64 = 1299,
  Andnps_xmm_xmmm128 = 1300,
  VEX_Vandnps_xmm_xmm_xmmm128 = 1301,
  VEX_Vandnps_ymm_ymm_ymmm256 = 1302,
  EVEX_Vandnps_xmm_k1z_xmm_xmmm128b32 = 1303,
  EVEX_Vandnps_ymm_k1z_ymm_ymmm256b32 = 1304,
  EVEX_Vandnps_zmm_k1z_zmm_zmmm512b32 = 1305,
  Andnpd_xmm_xmmm128 = 1306,
  VEX_Vandnpd_xmm_xmm_xmmm128 = 1307,
  VEX_Vandnpd_ymm_ymm_ymmm256 = 1308,
  EVEX_Vandnpd_xmm_k1z_xmm_xmmm128b64 = 1309,
  EVEX_Vandnpd_ymm_k1z_ymm_ymmm256b64 = 1310,
  EVEX_Vandnpd_zmm_k1z_zmm_zmmm512b64 = 1311,
  Orps_xmm_xmmm128 = 1312,
  VEX_Vorps_xmm_xmm_xmmm128 = 1313,
  VEX_Vorps_ymm_ymm_ymmm256 = 1314,
  EVEX_Vorps_xmm_k1z_xmm_xmmm128b32 = 1315,
  EVEX_Vorps_ymm_k1z_ymm_ymmm256b32 = 1316,
  EVEX_Vorps_zmm_k1z_zmm_zmmm512b32 = 1317,
  Orpd_xmm_xmmm128 = 1318,
  VEX_Vorpd_xmm_xmm_xmmm128 = 1319,
  VEX_Vorpd_ymm_ymm_ymmm256 = 1320,
  EVEX_Vorpd_xmm_k1z_xmm_xmmm128b64 = 1321,
  EVEX_Vorpd_ymm_k1z_ymm_ymmm256b64 = 1322,
  EVEX_Vorpd_zmm_k1z_zmm_zmmm512b64 = 1323,
  Xorps_xmm_xmmm128 = 1324,
  VEX_Vxorps_xmm_xmm_xmmm128 = 1325,
  VEX_Vxorps_ymm_ymm_ymmm256 = 1326,
  EVEX_Vxorps_xmm_k1z_xmm_xmmm128b32 = 1327,
  EVEX_Vxorps_ymm_k1z_ymm_ymmm256b32 = 1328,
  EVEX_Vxorps_zmm_k1z_zmm_zmmm512b32 = 1329,
  Xorpd_xmm_xmmm128 = 1330,
  VEX_Vxorpd_xmm_xmm_xmmm128 = 1331,
  VEX_Vxorpd_ymm_ymm_ymmm256 = 1332,
  EVEX_Vxorpd_xmm_k1z_xmm_xmmm128b64 = 1333,
  EVEX_Vxorpd_ymm_k1z_ymm_ymmm256b64 = 1334,
  EVEX_Vxorpd_zmm_k1z_zmm_zmmm512b64 = 1335,
  Addps_xmm_xmmm128 = 1336,
  VEX_Vaddps_xmm_xmm_xmmm128 = 1337,
  VEX_Vaddps_ymm_ymm_ymmm256 = 1338,
  EVEX_Vaddps_xmm_k1z_xmm_xmmm128b32 = 1339,
  EVEX_Vaddps_ymm_k1z_ymm_ymmm256b32 = 1340,
  EVEX_Vaddps_zmm_k1z_zmm_zmmm512b32_er = 1341,
  Addpd_xmm_xmmm128 = 1342,
  VEX_Vaddpd_xmm_xmm_xmmm128 = 1343,
  VEX_Vaddpd_ymm_ymm_ymmm256 = 1344,
  EVEX_Vaddpd_xmm_k1z_xmm_xmmm128b64 = 1345,
  EVEX_Vaddpd_ymm_k1z_ymm_ymmm256b64 = 1346,
  EVEX_Vaddpd_zmm_k1z_zmm_zmmm512b64_er = 1347,
  Addss_xmm_xmmm32 = 1348,
  VEX_Vaddss_xmm_xmm_xmmm32 = 1349,
  EVEX_Vaddss_xmm_k1z_xmm_xmmm32_er = 1350,
  Addsd_xmm_xmmm64 = 1351,
  VEX_Vaddsd_xmm_xmm_xmmm64 = 1352,
  EVEX_Vaddsd_xmm_k1z_xmm_xmmm64_er = 1353,
  Mulps_xmm_xmmm128 = 1354,
  VEX_Vmulps_xmm_xmm_xmmm128 = 1355,
  VEX_Vmulps_ymm_ymm_ymmm256 = 1356,
  EVEX_Vmulps_xmm_k1z_xmm_xmmm128b32 = 1357,
  EVEX_Vmulps_ymm_k1z_ymm_ymmm256b32 = 1358,
  EVEX_Vmulps_zmm_k1z_zmm_zmmm512b32_er = 1359,
  Mulpd_xmm_xmmm128 = 1360,
  VEX_Vmulpd_xmm_xmm_xmmm128 = 1361,
  VEX_Vmulpd_ymm_ymm_ymmm256 = 1362,
  EVEX_Vmulpd_xmm_k1z_xmm_xmmm128b64 = 1363,
  EVEX_Vmulpd_ymm_k1z_ymm_ymmm256b64 = 1364,
  EVEX_Vmulpd_zmm_k1z_zmm_zmmm512b64_er = 1365,
  Mulss_xmm_xmmm32 = 1366,
  VEX_Vmulss_xmm_xmm_xmmm32 = 1367,
  EVEX_Vmulss_xmm_k1z_xmm_xmmm32_er = 1368,
  Mulsd_xmm_xmmm64 = 1369,
  VEX_Vmulsd_xmm_xmm_xmmm64 = 1370,
  EVEX_Vmulsd_xmm_k1z_xmm_xmmm64_er = 1371,
  Cvtps2pd_xmm_xmmm64 = 1372,
  VEX_Vcvtps2pd_xmm_xmmm64 = 1373,
  VEX_Vcvtps2pd_ymm_xmmm128 = 1374,
  EVEX_Vcvtps2pd_xmm_k1z_xmmm64b32 = 1375,
  EVEX_Vcvtps2pd_ymm_k1z_xmmm128b32 = 1376,
  EVEX_Vcvtps2pd_zmm_k1z_ymmm256b32_sae = 1377,
  Cvtpd2ps_xmm_xmmm128 = 1378,
  VEX_Vcvtpd2ps_xmm_xmmm128 = 1379,
  VEX_Vcvtpd2ps_xmm_ymmm256 = 1380,
  EVEX_Vcvtpd2ps_xmm_k1z_xmmm128b64 = 1381,
  EVEX_Vcvtpd2ps_xmm_k1z_ymmm256b64 = 1382,
  EVEX_Vcvtpd2ps_ymm_k1z_zmmm512b64_er = 1383,
  Cvtss2sd_xmm_xmmm32 = 1384,
  VEX_Vcvtss2sd_xmm_xmm_xmmm32 = 1385,
  EVEX_Vcvtss2sd_xmm_k1z_xmm_xmmm32_sae = 1386,
  Cvtsd2ss_xmm_xmmm64 = 1387,
  VEX_Vcvtsd2ss_xmm_xmm_xmmm64 = 1388,
  EVEX_Vcvtsd2ss_xmm_k1z_xmm_xmmm64_er = 1389,
  Cvtdq2ps_xmm_xmmm128 = 1390,
  VEX_Vcvtdq2ps_xmm_xmmm128 = 1391,
  VEX_Vcvtdq2ps_ymm_ymmm256 = 1392,
  EVEX_Vcvtdq2ps_xmm_k1z_xmmm128b32 = 1393,
  EVEX_Vcvtdq2ps_ymm_k1z_ymmm256b32 = 1394,
  EVEX_Vcvtdq2ps_zmm_k1z_zmmm512b32_er = 1395,
  EVEX_Vcvtqq2ps_xmm_k1z_xmmm128b64 = 1396,
  EVEX_Vcvtqq2ps_xmm_k1z_ymmm256b64 = 1397,
  EVEX_Vcvtqq2ps_ymm_k1z_zmmm512b64_er = 1398,
  Cvtps2dq_xmm_xmmm128 = 1399,
  VEX_Vcvtps2dq_xmm_xmmm128 = 1400,
  VEX_Vcvtps2dq_ymm_ymmm256 = 1401,
  EVEX_Vcvtps2dq_xmm_k1z_xmmm128b32 = 1402,
  EVEX_Vcvtps2dq_ymm_k1z_ymmm256b32 = 1403,
  EVEX_Vcvtps2dq_zmm_k1z_zmmm512b32_er = 1404,
  Cvttps2dq_xmm_xmmm128 = 1405,
  VEX_Vcvttps2dq_xmm_xmmm128 = 1406,
  VEX_Vcvttps2dq_ymm_ymmm256 = 1407,
  EVEX_Vcvttps2dq_xmm_k1z_xmmm128b32 = 1408,
  EVEX_Vcvttps2dq_ymm_k1z_ymmm256b32 = 1409,
  EVEX_Vcvttps2dq_zmm_k1z_zmmm512b32_sae = 1410,
  Subps_xmm_xmmm128 = 1411,
  VEX_Vsubps_xmm_xmm_xmmm128 = 1412,
  VEX_Vsubps_ymm_ymm_ymmm256 = 1413,
  EVEX_Vsubps_xmm_k1z_xmm_xmmm128b32 = 1414,
  EVEX_Vsubps_ymm_k1z_ymm_ymmm256b32 = 1415,
  EVEX_Vsubps_zmm_k1z_zmm_zmmm512b32_er = 1416,
  Subpd_xmm_xmmm128 = 1417,
  VEX_Vsubpd_xmm_xmm_xmmm128 = 1418,
  VEX_Vsubpd_ymm_ymm_ymmm256 = 1419,
  EVEX_Vsubpd_xmm_k1z_xmm_xmmm128b64 = 1420,
  EVEX_Vsubpd_ymm_k1z_ymm_ymmm256b64 = 1421,
  EVEX_Vsubpd_zmm_k1z_zmm_zmmm512b64_er = 1422,
  Subss_xmm_xmmm32 = 1423,
  VEX_Vsubss_xmm_xmm_xmmm32 = 1424,
  EVEX_Vsubss_xmm_k1z_xmm_xmmm32_er = 1425,
  Subsd_xmm_xmmm64 = 1426,
  VEX_Vsubsd_xmm_xmm_xmmm64 = 1427,
  EVEX_Vsubsd_xmm_k1z_xmm_xmmm64_er = 1428,
  Minps_xmm_xmmm128 = 1429,
  VEX_Vminps_xmm_xmm_xmmm128 = 1430,
  VEX_Vminps_ymm_ymm_ymmm256 = 1431,
  EVEX_Vminps_xmm_k1z_xmm_xmmm128b32 = 1432,
  EVEX_Vminps_ymm_k1z_ymm_ymmm256b32 = 1433,
  EVEX_Vminps_zmm_k1z_zmm_zmmm512b32_sae = 1434,
  Minpd_xmm_xmmm128 = 1435,
  VEX_Vminpd_xmm_xmm_xmmm128 = 1436,
  VEX_Vminpd_ymm_ymm_ymmm256 = 1437,
  EVEX_Vminpd_xmm_k1z_xmm_xmmm128b64 = 1438,
  EVEX_Vminpd_ymm_k1z_ymm_ymmm256b64 = 1439,
  EVEX_Vminpd_zmm_k1z_zmm_zmmm512b64_sae = 1440,
  Minss_xmm_xmmm32 = 1441,
  VEX_Vminss_xmm_xmm_xmmm32 = 1442,
  EVEX_Vminss_xmm_k1z_xmm_xmmm32_sae = 1443,
  Minsd_xmm_xmmm64 = 1444,
  VEX_Vminsd_xmm_xmm_xmmm64 = 1445,
  EVEX_Vminsd_xmm_k1z_xmm_xmmm64_sae = 1446,
  Divps_xmm_xmmm128 = 1447,
  VEX_Vdivps_xmm_xmm_xmmm128 = 1448,
  VEX_Vdivps_ymm_ymm_ymmm256 = 1449,
  EVEX_Vdivps_xmm_k1z_xmm_xmmm128b32 = 1450,
  EVEX_Vdivps_ymm_k1z_ymm_ymmm256b32 = 1451,
  EVEX_Vdivps_zmm_k1z_zmm_zmmm512b32_er = 1452,
  Divpd_xmm_xmmm128 = 1453,
  VEX_Vdivpd_xmm_xmm_xmmm128 = 1454,
  VEX_Vdivpd_ymm_ymm_ymmm256 = 1455,
  EVEX_Vdivpd_xmm_k1z_xmm_xmmm128b64 = 1456,
  EVEX_Vdivpd_ymm_k1z_ymm_ymmm256b64 = 1457,
  EVEX_Vdivpd_zmm_k1z_zmm_zmmm512b64_er = 1458,
  Divss_xmm_xmmm32 = 1459,
  VEX_Vdivss_xmm_xmm_xmmm32 = 1460,
  EVEX_Vdivss_xmm_k1z_xmm_xmmm32_er = 1461,
  Divsd_xmm_xmmm64 = 1462,
  VEX_Vdivsd_xmm_xmm_xmmm64 = 1463,
  EVEX_Vdivsd_xmm_k1z_xmm_xmmm64_er = 1464,
  Maxps_xmm_xmmm128 = 1465,
  VEX_Vmaxps_xmm_xmm_xmmm128 = 1466,
  VEX_Vmaxps_ymm_ymm_ymmm256 = 1467,
  EVEX_Vmaxps_xmm_k1z_xmm_xmmm128b32 = 1468,
  EVEX_Vmaxps_ymm_k1z_ymm_ymmm256b32 = 1469,
  EVEX_Vmaxps_zmm_k1z_zmm_zmmm512b32_sae = 1470,
  Maxpd_xmm_xmmm128 = 1471,
  VEX_Vmaxpd_xmm_xmm_xmmm128 = 1472,
  VEX_Vmaxpd_ymm_ymm_ymmm256 = 1473,
  EVEX_Vmaxpd_xmm_k1z_xmm_xmmm128b64 = 1474,
  EVEX_Vmaxpd_ymm_k1z_ymm_ymmm256b64 = 1475,
  EVEX_Vmaxpd_zmm_k1z_zmm_zmmm512b64_sae = 1476,
  Maxss_xmm_xmmm32 = 1477,
  VEX_Vmaxss_xmm_xmm_xmmm32 = 1478,
  EVEX_Vmaxss_xmm_k1z_xmm_xmmm32_sae = 1479,
  Maxsd_xmm_xmmm64 = 1480,
  VEX_Vmaxsd_xmm_xmm_xmmm64 = 1481,
  EVEX_Vmaxsd_xmm_k1z_xmm_xmmm64_sae = 1482,
  Punpcklbw_mm_mmm32 = 1483,
  Punpcklbw_xmm_xmmm128 = 1484,
  VEX_Vpunpcklbw_xmm_xmm_xmmm128 = 1485,
  VEX_Vpunpcklbw_ymm_ymm_ymmm256 = 1486,
  EVEX_Vpunpcklbw_xmm_k1z_xmm_xmmm128 = 1487,
  EVEX_Vpunpcklbw_ymm_k1z_ymm_ymmm256 = 1488,
  EVEX_Vpunpcklbw_zmm_k1z_zmm_zmmm512 = 1489,
  Punpcklwd_mm_mmm32 = 1490,
  Punpcklwd_xmm_xmmm128 = 1491,
  VEX_Vpunpcklwd_xmm_xmm_xmmm128 = 1492,
  VEX_Vpunpcklwd_ymm_ymm_ymmm256 = 1493,
  EVEX_Vpunpcklwd_xmm_k1z_xmm_xmmm128 = 1494,
  EVEX_Vpunpcklwd_ymm_k1z_ymm_ymmm256 = 1495,
  EVEX_Vpunpcklwd_zmm_k1z_zmm_zmmm512 = 1496,
  Punpckldq_mm_mmm32 = 1497,
  Punpckldq_xmm_xmmm128 = 1498,
  VEX_Vpunpckldq_xmm_xmm_xmmm128 = 1499,
  VEX_Vpunpckldq_ymm_ymm_ymmm256 = 1500,
  EVEX_Vpunpckldq_xmm_k1z_xmm_xmmm128b32 = 1501,
  EVEX_Vpunpckldq_ymm_k1z_ymm_ymmm256b32 = 1502,
  EVEX_Vpunpckldq_zmm_k1z_zmm_zmmm512b32 = 1503,
  Packsswb_mm_mmm64 = 1504,
  Packsswb_xmm_xmmm128 = 1505,
  VEX_Vpacksswb_xmm_xmm_xmmm128 = 1506,
  VEX_Vpacksswb_ymm_ymm_ymmm256 = 1507,
  EVEX_Vpacksswb_xmm_k1z_xmm_xmmm128 = 1508,
  EVEX_Vpacksswb_ymm_k1z_ymm_ymmm256 = 1509,
  EVEX_Vpacksswb_zmm_k1z_zmm_zmmm512 = 1510,
  Pcmpgtb_mm_mmm64 = 1511,
  Pcmpgtb_xmm_xmmm128 = 1512,
  VEX_Vpcmpgtb_xmm_xmm_xmmm128 = 1513,
  VEX_Vpcmpgtb_ymm_ymm_ymmm256 = 1514,
  EVEX_Vpcmpgtb_kr_k1_xmm_xmmm128 = 1515,
  EVEX_Vpcmpgtb_kr_k1_ymm_ymmm256 = 1516,
  EVEX_Vpcmpgtb_kr_k1_zmm_zmmm512 = 1517,
  Pcmpgtw_mm_mmm64 = 1518,
  Pcmpgtw_xmm_xmmm128 = 1519,
  VEX_Vpcmpgtw_xmm_xmm_xmmm128 = 1520,
  VEX_Vpcmpgtw_ymm_ymm_ymmm256 = 1521,
  EVEX_Vpcmpgtw_kr_k1_xmm_xmmm128 = 1522,
  EVEX_Vpcmpgtw_kr_k1_ymm_ymmm256 = 1523,
  EVEX_Vpcmpgtw_kr_k1_zmm_zmmm512 = 1524,
  Pcmpgtd_mm_mmm64 = 1525,
  Pcmpgtd_xmm_xmmm128 = 1526,
  VEX_Vpcmpgtd_xmm_xmm_xmmm128 = 1527,
  VEX_Vpcmpgtd_ymm_ymm_ymmm256 = 1528,
  EVEX_Vpcmpgtd_kr_k1_xmm_xmmm128b32 = 1529,
  EVEX_Vpcmpgtd_kr_k1_ymm_ymmm256b32 = 1530,
  EVEX_Vpcmpgtd_kr_k1_zmm_zmmm512b32 = 1531,
  Packuswb_mm_mmm64 = 1532,
  Packuswb_xmm_xmmm128 = 1533,
  VEX_Vpackuswb_xmm_xmm_xmmm128 = 1534,
  VEX_Vpackuswb_ymm_ymm_ymmm256 = 1535,
  EVEX_Vpackuswb_xmm_k1z_xmm_xmmm128 = 1536,
  EVEX_Vpackuswb_ymm_k1z_ymm_ymmm256 = 1537,
  EVEX_Vpackuswb_zmm_k1z_zmm_zmmm512 = 1538,
  Punpckhbw_mm_mmm64 = 1539,
  Punpckhbw_xmm_xmmm128 = 1540,
  VEX_Vpunpckhbw_xmm_xmm_xmmm128 = 1541,
  VEX_Vpunpckhbw_ymm_ymm_ymmm256 = 1542,
  EVEX_Vpunpckhbw_xmm_k1z_xmm_xmmm128 = 1543,
  EVEX_Vpunpckhbw_ymm_k1z_ymm_ymmm256 = 1544,
  EVEX_Vpunpckhbw_zmm_k1z_zmm_zmmm512 = 1545,
  Punpckhwd_mm_mmm64 = 1546,
  Punpckhwd_xmm_xmmm128 = 1547,
  VEX_Vpunpckhwd_xmm_xmm_xmmm128 = 1548,
  VEX_Vpunpckhwd_ymm_ymm_ymmm256 = 1549,
  EVEX_Vpunpckhwd_xmm_k1z_xmm_xmmm128 = 1550,
  EVEX_Vpunpckhwd_ymm_k1z_ymm_ymmm256 = 1551,
  EVEX_Vpunpckhwd_zmm_k1z_zmm_zmmm512 = 1552,
  Punpckhdq_mm_mmm64 = 1553,
  Punpckhdq_xmm_xmmm128 = 1554,
  VEX_Vpunpckhdq_xmm_xmm_xmmm128 = 1555,
  VEX_Vpunpckhdq_ymm_ymm_ymmm256 = 1556,
  EVEX_Vpunpckhdq_xmm_k1z_xmm_xmmm128b32 = 1557,
  EVEX_Vpunpckhdq_ymm_k1z_ymm_ymmm256b32 = 1558,
  EVEX_Vpunpckhdq_zmm_k1z_zmm_zmmm512b32 = 1559,
  Packssdw_mm_mmm64 = 1560,
  Packssdw_xmm_xmmm128 = 1561,
  VEX_Vpackssdw_xmm_xmm_xmmm128 = 1562,
  VEX_Vpackssdw_ymm_ymm_ymmm256 = 1563,
  EVEX_Vpackssdw_xmm_k1z_xmm_xmmm128b32 = 1564,
  EVEX_Vpackssdw_ymm_k1z_ymm_ymmm256b32 = 1565,
  EVEX_Vpackssdw_zmm_k1z_zmm_zmmm512b32 = 1566,
  Punpcklqdq_xmm_xmmm128 = 1567,
  VEX_Vpunpcklqdq_xmm_xmm_xmmm128 = 1568,
  VEX_Vpunpcklqdq_ymm_ymm_ymmm256 = 1569,
  EVEX_Vpunpcklqdq_xmm_k1z_xmm_xmmm128b64 = 1570,
  EVEX_Vpunpcklqdq_ymm_k1z_ymm_ymmm256b64 = 1571,
  EVEX_Vpunpcklqdq_zmm_k1z_zmm_zmmm512b64 = 1572,
  Punpckhqdq_xmm_xmmm128 = 1573,
  VEX_Vpunpckhqdq_xmm_xmm_xmmm128 = 1574,
  VEX_Vpunpckhqdq_ymm_ymm_ymmm256 = 1575,
  EVEX_Vpunpckhqdq_xmm_k1z_xmm_xmmm128b64 = 1576,
  EVEX_Vpunpckhqdq_ymm_k1z_ymm_ymmm256b64 = 1577,
  EVEX_Vpunpckhqdq_zmm_k1z_zmm_zmmm512b64 = 1578,
  Movd_mm_rm32 = 1579,
  Movq_mm_rm64 = 1580,
  Movd_xmm_rm32 = 1581,
  Movq_xmm_rm64 = 1582,
  VEX_Vmovd_xmm_rm32 = 1583,
  VEX_Vmovq_xmm_rm64 = 1584,
  EVEX_Vmovd_xmm_rm32 = 1585,
  EVEX_Vmovq_xmm_rm64 = 1586,
  Movq_mm_mmm64 = 1587,
  Movdqa_xmm_xmmm128 = 1588,
  VEX_Vmovdqa_xmm_xmmm128 = 1589,
  VEX_Vmovdqa_ymm_ymmm256 = 1590,
  EVEX_Vmovdqa32_xmm_k1z_xmmm128 = 1591,
  EVEX_Vmovdqa32_ymm_k1z_ymmm256 = 1592,
  EVEX_Vmovdqa32_zmm_k1z_zmmm512 = 1593,
  EVEX_Vmovdqa64_xmm_k1z_xmmm128 = 1594,
  EVEX_Vmovdqa64_ymm_k1z_ymmm256 = 1595,
  EVEX_Vmovdqa64_zmm_k1z_zmmm512 = 1596,
  Movdqu_xmm_xmmm128 = 1597,
  VEX_Vmovdqu_xmm_xmmm128 = 1598,
  VEX_Vmovdqu_ymm_ymmm256 = 1599,
  EVEX_Vmovdqu32_xmm_k1z_xmmm128 = 1600,
  EVEX_Vmovdqu32_ymm_k1z_ymmm256 = 1601,
  EVEX_Vmovdqu32_zmm_k1z_zmmm512 = 1602,
  EVEX_Vmovdqu64_xmm_k1z_xmmm128 = 1603,
  EVEX_Vmovdqu64_ymm_k1z_ymmm256 = 1604,
  EVEX_Vmovdqu64_zmm_k1z_zmmm512 = 1605,
  EVEX_Vmovdqu8_xmm_k1z_xmmm128 = 1606,
  EVEX_Vmovdqu8_ymm_k1z_ymmm256 = 1607,
  EVEX_Vmovdqu8_zmm_k1z_zmmm512 = 1608,
  EVEX_Vmovdqu16_xmm_k1z_xmmm128 = 1609,
  EVEX_Vmovdqu16_ymm_k1z_ymmm256 = 1610,
  EVEX_Vmovdqu16_zmm_k1z_zmmm512 = 1611,
  Pshufw_mm_mmm64_imm8 = 1612,
  Pshufd_xmm_xmmm128_imm8 = 1613,
  VEX_Vpshufd_xmm_xmmm128_imm8 = 1614,
  VEX_Vpshufd_ymm_ymmm256_imm8 = 1615,
  EVEX_Vpshufd_xmm_k1z_xmmm128b32_imm8 = 1616,
  EVEX_Vpshufd_ymm_k1z_ymmm256b32_imm8 = 1617,
  EVEX_Vpshufd_zmm_k1z_zmmm512b32_imm8 = 1618,
  Pshufhw_xmm_xmmm128_imm8 = 1619,
  VEX_Vpshufhw_xmm_xmmm128_imm8 = 1620,
  VEX_Vpshufhw_ymm_ymmm256_imm8 = 1621,
  EVEX_Vpshufhw_xmm_k1z_xmmm128_imm8 = 1622,
  EVEX_Vpshufhw_ymm_k1z_ymmm256_imm8 = 1623,
  EVEX_Vpshufhw_zmm_k1z_zmmm512_imm8 = 1624,
  Pshuflw_xmm_xmmm128_imm8 = 1625,
  VEX_Vpshuflw_xmm_xmmm128_imm8 = 1626,
  VEX_Vpshuflw_ymm_ymmm256_imm8 = 1627,
  EVEX_Vpshuflw_xmm_k1z_xmmm128_imm8 = 1628,
  EVEX_Vpshuflw_ymm_k1z_ymmm256_imm8 = 1629,
  EVEX_Vpshuflw_zmm_k1z_zmmm512_imm8 = 1630,
  Psrlw_mm_imm8 = 1631,
  Psrlw_xmm_imm8 = 1632,
  VEX_Vpsrlw_xmm_xmm_imm8 = 1633,
  VEX_Vpsrlw_ymm_ymm_imm8 = 1634,
  EVEX_Vpsrlw_xmm_k1z_xmmm128_imm8 = 1635,
  EVEX_Vpsrlw_ymm_k1z_ymmm256_imm8 = 1636,
  EVEX_Vpsrlw_zmm_k1z_zmmm512_imm8 = 1637,
  Psraw_mm_imm8 = 1638,
  Psraw_xmm_imm8 = 1639,
  VEX_Vpsraw_xmm_xmm_imm8 = 1640,
  VEX_Vpsraw_ymm_ymm_imm8 = 1641,
  EVEX_Vpsraw_xmm_k1z_xmmm128_imm8 = 1642,
  EVEX_Vpsraw_ymm_k1z_ymmm256_imm8 = 1643,
  EVEX_Vpsraw_zmm_k1z_zmmm512_imm8 = 1644,
  Psllw_mm_imm8 = 1645,
  Psllw_xmm_imm8 = 1646,
  VEX_Vpsllw_xmm_xmm_imm8 = 1647,
  VEX_Vpsllw_ymm_ymm_imm8 = 1648,
  EVEX_Vpsllw_xmm_k1z_xmmm128_imm8 = 1649,
  EVEX_Vpsllw_ymm_k1z_ymmm256_imm8 = 1650,
  EVEX_Vpsllw_zmm_k1z_zmmm512_imm8 = 1651,
  EVEX_Vprord_xmm_k1z_xmmm128b32_imm8 = 1652,
  EVEX_Vprord_ymm_k1z_ymmm256b32_imm8 = 1653,
  EVEX_Vprord_zmm_k1z_zmmm512b32_imm8 = 1654,
  EVEX_Vprorq_xmm_k1z_xmmm128b64_imm8 = 1655,
  EVEX_Vprorq_ymm_k1z_ymmm256b64_imm8 = 1656,
  EVEX_Vprorq_zmm_k1z_zmmm512b64_imm8 = 1657,
  EVEX_Vprold_xmm_k1z_xmmm128b32_imm8 = 1658,
  EVEX_Vprold_ymm_k1z_ymmm256b32_imm8 = 1659,
  EVEX_Vprold_zmm_k1z_zmmm512b32_imm8 = 1660,
  EVEX_Vprolq_xmm_k1z_xmmm128b64_imm8 = 1661,
  EVEX_Vprolq_ymm_k1z_ymmm256b64_imm8 = 1662,
  EVEX_Vprolq_zmm_k1z_zmmm512b64_imm8 = 1663,
  Psrld_mm_imm8 = 1664,
  Psrld_xmm_imm8 = 1665,
  VEX_Vpsrld_xmm_xmm_imm8 = 1666,
  VEX_Vpsrld_ymm_ymm_imm8 = 1667,
  EVEX_Vpsrld_xmm_k1z_xmmm128b32_imm8 = 1668,
  EVEX_Vpsrld_ymm_k1z_ymmm256b32_imm8 = 1669,
  EVEX_Vpsrld_zmm_k1z_zmmm512b32_imm8 = 1670,
  Psrad_mm_imm8 = 1671,
  Psrad_xmm_imm8 = 1672,
  VEX_Vpsrad_xmm_xmm_imm8 = 1673,
  VEX_Vpsrad_ymm_ymm_imm8 = 1674,
  EVEX_Vpsrad_xmm_k1z_xmmm128b32_imm8 = 1675,
  EVEX_Vpsrad_ymm_k1z_ymmm256b32_imm8 = 1676,
  EVEX_Vpsrad_zmm_k1z_zmmm512b32_imm8 = 1677,
  EVEX_Vpsraq_xmm_k1z_xmmm128b64_imm8 = 1678,
  EVEX_Vpsraq_ymm_k1z_ymmm256b64_imm8 = 1679,
  EVEX_Vpsraq_zmm_k1z_zmmm512b64_imm8 = 1680,
  Pslld_mm_imm8 = 1681,
  Pslld_xmm_imm8 = 1682,
  VEX_Vpslld_xmm_xmm_imm8 = 1683,
  VEX_Vpslld_ymm_ymm_imm8 = 1684,
  EVEX_Vpslld_xmm_k1z_xmmm128b32_imm8 = 1685,
  EVEX_Vpslld_ymm_k1z_ymmm256b32_imm8 = 1686,
  EVEX_Vpslld_zmm_k1z_zmmm512b32_imm8 = 1687,
  Psrlq_mm_imm8 = 1688,
  Psrlq_xmm_imm8 = 1689,
  VEX_Vpsrlq_xmm_xmm_imm8 = 1690,
  VEX_Vpsrlq_ymm_ymm_imm8 = 1691,
  EVEX_Vpsrlq_xmm_k1z_xmmm128b64_imm8 = 1692,
  EVEX_Vpsrlq_ymm_k1z_ymmm256b64_imm8 = 1693,
  EVEX_Vpsrlq_zmm_k1z_zmmm512b64_imm8 = 1694,
  Psrldq_xmm_imm8 = 1695,
  VEX_Vpsrldq_xmm_xmm_imm8 = 1696,
  VEX_Vpsrldq_ymm_ymm_imm8 = 1697,
  EVEX_Vpsrldq_xmm_xmmm128_imm8 = 1698,
  EVEX_Vpsrldq_ymm_ymmm256_imm8 = 1699,
  EVEX_Vpsrldq_zmm_zmmm512_imm8 = 1700,
  Psllq_mm_imm8 = 1701,
  Psllq_xmm_imm8 = 1702,
  VEX_Vpsllq_xmm_xmm_imm8 = 1703,
  VEX_Vpsllq_ymm_ymm_imm8 = 1704,
  EVEX_Vpsllq_xmm_k1z_xmmm128b64_imm8 = 1705,
  EVEX_Vpsllq_ymm_k1z_ymmm256b64_imm8 = 1706,
  EVEX_Vpsllq_zmm_k1z_zmmm512b64_imm8 = 1707,
  Pslldq_xmm_imm8 = 1708,
  VEX_Vpslldq_xmm_xmm_imm8 = 1709,
  VEX_Vpslldq_ymm_ymm_imm8 = 1710,
  EVEX_Vpslldq_xmm_xmmm128_imm8 = 1711,
  EVEX_Vpslldq_ymm_ymmm256_imm8 = 1712,
  EVEX_Vpslldq_zmm_zmmm512_imm8 = 1713,
  Pcmpeqb_mm_mmm64 = 1714,
  Pcmpeqb_xmm_xmmm128 = 1715,
  VEX_Vpcmpeqb_xmm_xmm_xmmm128 = 1716,
  VEX_Vpcmpeqb_ymm_ymm_ymmm256 = 1717,
  EVEX_Vpcmpeqb_kr_k1_xmm_xmmm128 = 1718,
  EVEX_Vpcmpeqb_kr_k1_ymm_ymmm256 = 1719,
  EVEX_Vpcmpeqb_kr_k1_zmm_zmmm512 = 1720,
  Pcmpeqw_mm_mmm64 = 1721,
  Pcmpeqw_xmm_xmmm128 = 1722,
  VEX_Vpcmpeqw_xmm_xmm_xmmm128 = 1723,
  VEX_Vpcmpeqw_ymm_ymm_ymmm256 = 1724,
  EVEX_Vpcmpeqw_kr_k1_xmm_xmmm128 = 1725,
  EVEX_Vpcmpeqw_kr_k1_ymm_ymmm256 = 1726,
  EVEX_Vpcmpeqw_kr_k1_zmm_zmmm512 = 1727,
  Pcmpeqd_mm_mmm64 = 1728,
  Pcmpeqd_xmm_xmmm128 = 1729,
  VEX_Vpcmpeqd_xmm_xmm_xmmm128 = 1730,
  VEX_Vpcmpeqd_ymm_ymm_ymmm256 = 1731,
  EVEX_Vpcmpeqd_kr_k1_xmm_xmmm128b32 = 1732,
  EVEX_Vpcmpeqd_kr_k1_ymm_ymmm256b32 = 1733,
  EVEX_Vpcmpeqd_kr_k1_zmm_zmmm512b32 = 1734,
  Emms = 1735,
  VEX_Vzeroupper = 1736,
  VEX_Vzeroall = 1737,
  Vmread_rm32_r32 = 1738,
  Vmread_rm64_r64 = 1739,
  EVEX_Vcvttps2udq_xmm_k1z_xmmm128b32 = 1740,
  EVEX_Vcvttps2udq_ymm_k1z_ymmm256b32 = 1741,
  EVEX_Vcvttps2udq_zmm_k1z_zmmm512b32_sae = 1742,
  EVEX_Vcvttpd2udq_xmm_k1z_xmmm128b64 = 1743,
  EVEX_Vcvttpd2udq_xmm_k1z_ymmm256b64 = 1744,
  EVEX_Vcvttpd2udq_ymm_k1z_zmmm512b64_sae = 1745,
  Extrq_xmm_imm8_imm8 = 1746,
  EVEX_Vcvttps2uqq_xmm_k1z_xmmm64b32 = 1747,
  EVEX_Vcvttps2uqq_ymm_k1z_xmmm128b32 = 1748,
  EVEX_Vcvttps2uqq_zmm_k1z_ymmm256b32_sae = 1749,
  EVEX_Vcvttpd2uqq_xmm_k1z_xmmm128b64 = 1750,
  EVEX_Vcvttpd2uqq_ymm_k1z_ymmm256b64 = 1751,
  EVEX_Vcvttpd2uqq_zmm_k1z_zmmm512b64_sae = 1752,
  EVEX_Vcvttss2usi_r32_xmmm32_sae = 1753,
  EVEX_Vcvttss2usi_r64_xmmm32_sae = 1754,
  Insertq_xmm_xmm_imm8_imm8 = 1755,
  EVEX_Vcvttsd2usi_r32_xmmm64_sae = 1756,
  EVEX_Vcvttsd2usi_r64_xmmm64_sae = 1757,
  Vmwrite_r32_rm32 = 1758,
  Vmwrite_r64_rm64 = 1759,
  EVEX_Vcvtps2udq_xmm_k1z_xmmm128b32 = 1760,
  EVEX_Vcvtps2udq_ymm_k1z_ymmm256b32 = 1761,
  EVEX_Vcvtps2udq_zmm_k1z_zmmm512b32_er = 1762,
  EVEX_Vcvtpd2udq_xmm_k1z_xmmm128b64 = 1763,
  EVEX_Vcvtpd2udq_xmm_k1z_ymmm256b64 = 1764,
  EVEX_Vcvtpd2udq_ymm_k1z_zmmm512b64_er = 1765,
  Extrq_xmm_xmm = 1766,
  EVEX_Vcvtps2uqq_xmm_k1z_xmmm64b32 = 1767,
  EVEX_Vcvtps2uqq_ymm_k1z_xmmm128b32 = 1768,
  EVEX_Vcvtps2uqq_zmm_k1z_ymmm256b32_er = 1769,
  EVEX_Vcvtpd2uqq_xmm_k1z_xmmm128b64 = 1770,
  EVEX_Vcvtpd2uqq_ymm_k1z_ymmm256b64 = 1771,
  EVEX_Vcvtpd2uqq_zmm_k1z_zmmm512b64_er = 1772,
  EVEX_Vcvtss2usi_r32_xmmm32_er = 1773,
  EVEX_Vcvtss2usi_r64_xmmm32_er = 1774,
  Insertq_xmm_xmm = 1775,
  EVEX_Vcvtsd2usi_r32_xmmm64_er = 1776,
  EVEX_Vcvtsd2usi_r64_xmmm64_er = 1777,
  EVEX_Vcvttps2qq_xmm_k1z_xmmm64b32 = 1778,
  EVEX_Vcvttps2qq_ymm_k1z_xmmm128b32 = 1779,
  EVEX_Vcvttps2qq_zmm_k1z_ymmm256b32_sae = 1780,
  EVEX_Vcvttpd2qq_xmm_k1z_xmmm128b64 = 1781,
  EVEX_Vcvttpd2qq_ymm_k1z_ymmm256b64 = 1782,
  EVEX_Vcvttpd2qq_zmm_k1z_zmmm512b64_sae = 1783,
  EVEX_Vcvtudq2pd_xmm_k1z_xmmm64b32 = 1784,
  EVEX_Vcvtudq2pd_ymm_k1z_xmmm128b32 = 1785,
  EVEX_Vcvtudq2pd_zmm_k1z_ymmm256b32_er = 1786,
  EVEX_Vcvtuqq2pd_xmm_k1z_xmmm128b64 = 1787,
  EVEX_Vcvtuqq2pd_ymm_k1z_ymmm256b64 = 1788,
  EVEX_Vcvtuqq2pd_zmm_k1z_zmmm512b64_er = 1789,
  EVEX_Vcvtudq2ps_xmm_k1z_xmmm128b32 = 1790,
  EVEX_Vcvtudq2ps_ymm_k1z_ymmm256b32 = 1791,
  EVEX_Vcvtudq2ps_zmm_k1z_zmmm512b32_er = 1792,
  EVEX_Vcvtuqq2ps_xmm_k1z_xmmm128b64 = 1793,
  EVEX_Vcvtuqq2ps_xmm_k1z_ymmm256b64 = 1794,
  EVEX_Vcvtuqq2ps_ymm_k1z_zmmm512b64_er = 1795,
  EVEX_Vcvtps2qq_xmm_k1z_xmmm64b32 = 1796,
  EVEX_Vcvtps2qq_ymm_k1z_xmmm128b32 = 1797,
  EVEX_Vcvtps2qq_zmm_k1z_ymmm256b32_er = 1798,
  EVEX_Vcvtpd2qq_xmm_k1z_xmmm128b64 = 1799,
  EVEX_Vcvtpd2qq_ymm_k1z_ymmm256b64 = 1800,
  EVEX_Vcvtpd2qq_zmm_k1z_zmmm512b64_er = 1801,
  EVEX_Vcvtusi2ss_xmm_xmm_rm32_er = 1802,
  EVEX_Vcvtusi2ss_xmm_xmm_rm64_er = 1803,
  EVEX_Vcvtusi2sd_xmm_xmm_rm32_er = 1804,
  EVEX_Vcvtusi2sd_xmm_xmm_rm64_er = 1805,
  Haddpd_xmm_xmmm128 = 1806,
  VEX_Vhaddpd_xmm_xmm_xmmm128 = 1807,
  VEX_Vhaddpd_ymm_ymm_ymmm256 = 1808,
  Haddps_xmm_xmmm128 = 1809,
  VEX_Vhaddps_xmm_xmm_xmmm128 = 1810,
  VEX_Vhaddps_ymm_ymm_ymmm256 = 1811,
  Hsubpd_xmm_xmmm128 = 1812,
  VEX_Vhsubpd_xmm_xmm_xmmm128 = 1813,
  VEX_Vhsubpd_ymm_ymm_ymmm256 = 1814,
  Hsubps_xmm_xmmm128 = 1815,
  VEX_Vhsubps_xmm_xmm_xmmm128 = 1816,
  VEX_Vhsubps_ymm_ymm_ymmm256 = 1817,
  Movd_rm32_mm = 1818,
  Movq_rm64_mm = 1819,
  Movd_rm32_xmm = 1820,
  Movq_rm64_xmm = 1821,
  VEX_Vmovd_rm32_xmm = 1822,
  VEX_Vmovq_rm64_xmm = 1823,
  EVEX_Vmovd_rm32_xmm = 1824,
  EVEX_Vmovq_rm64_xmm = 1825,
  Movq_xmm_xmmm64 = 1826,
  VEX_Vmovq_xmm_xmmm64 = 1827,
  EVEX_Vmovq_xmm_xmmm64 = 1828,
  Movq_mmm64_mm = 1829,
  Movdqa_xmmm128_xmm = 1830,
  VEX_Vmovdqa_xmmm128_xmm = 1831,
  VEX_Vmovdqa_ymmm256_ymm = 1832,
  EVEX_Vmovdqa32_xmmm128_k1z_xmm = 1833,
  EVEX_Vmovdqa32_ymmm256_k1z_ymm = 1834,
  EVEX_Vmovdqa32_zmmm512_k1z_zmm = 1835,
  EVEX_Vmovdqa64_xmmm128_k1z_xmm = 1836,
  EVEX_Vmovdqa64_ymmm256_k1z_ymm = 1837,
  EVEX_Vmovdqa64_zmmm512_k1z_zmm = 1838,
  Movdqu_xmmm128_xmm = 1839,
  VEX_Vmovdqu_xmmm128_xmm = 1840,
  VEX_Vmovdqu_ymmm256_ymm = 1841,
  EVEX_Vmovdqu32_xmmm128_k1z_xmm = 1842,
  EVEX_Vmovdqu32_ymmm256_k1z_ymm = 1843,
  EVEX_Vmovdqu32_zmmm512_k1z_zmm = 1844,
  EVEX_Vmovdqu64_xmmm128_k1z_xmm = 1845,
  EVEX_Vmovdqu64_ymmm256_k1z_ymm = 1846,
  EVEX_Vmovdqu64_zmmm512_k1z_zmm = 1847,
  EVEX_Vmovdqu8_xmmm128_k1z_xmm = 1848,
  EVEX_Vmovdqu8_ymmm256_k1z_ymm = 1849,
  EVEX_Vmovdqu8_zmmm512_k1z_zmm = 1850,
  EVEX_Vmovdqu16_xmmm128_k1z_xmm = 1851,
  EVEX_Vmovdqu16_ymmm256_k1z_ymm = 1852,
  EVEX_Vmovdqu16_zmmm512_k1z_zmm = 1853,
  Jo_rel16 = 1854,
  Jo_rel32_32 = 1855,
  Jo_rel32_64 = 1856,
  Jno_rel16 = 1857,
  Jno_rel32_32 = 1858,
  Jno_rel32_64 = 1859,
  Jb_rel16 = 1860,
  Jb_rel32_32 = 1861,
  Jb_rel32_64 = 1862,
  Jae_rel16 = 1863,
  Jae_rel32_32 = 1864,
  Jae_rel32_64 = 1865,
  Je_rel16 = 1866,
  Je_rel32_32 = 1867,
  Je_rel32_64 = 1868,
  Jne_rel16 = 1869,
  Jne_rel32_32 = 1870,
  Jne_rel32_64 = 1871,
  Jbe_rel16 = 1872,
  Jbe_rel32_32 = 1873,
  Jbe_rel32_64 = 1874,
  Ja_rel16 = 1875,
  Ja_rel32_32 = 1876,
  Ja_rel32_64 = 1877,
  Js_rel16 = 1878,
  Js_rel32_32 = 1879,
  Js_rel32_64 = 1880,
  Jns_rel16 = 1881,
  Jns_rel32_32 = 1882,
  Jns_rel32_64 = 1883,
  Jp_rel16 = 1884,
  Jp_rel32_32 = 1885,
  Jp_rel32_64 = 1886,
  Jnp_rel16 = 1887,
  Jnp_rel32_32 = 1888,
  Jnp_rel32_64 = 1889,
  Jl_rel16 = 1890,
  Jl_rel32_32 = 1891,
  Jl_rel32_64 = 1892,
  Jge_rel16 = 1893,
  Jge_rel32_32 = 1894,
  Jge_rel32_64 = 1895,
  Jle_rel16 = 1896,
  Jle_rel32_32 = 1897,
  Jle_rel32_64 = 1898,
  Jg_rel16 = 1899,
  Jg_rel32_32 = 1900,
  Jg_rel32_64 = 1901,
  Seto_rm8 = 1902,
  Setno_rm8 = 1903,
  Setb_rm8 = 1904,
  Setae_rm8 = 1905,
  Sete_rm8 = 1906,
  Setne_rm8 = 1907,
  Setbe_rm8 = 1908,
  Seta_rm8 = 1909,
  Sets_rm8 = 1910,
  Setns_rm8 = 1911,
  Setp_rm8 = 1912,
  Setnp_rm8 = 1913,
  Setl_rm8 = 1914,
  Setge_rm8 = 1915,
  Setle_rm8 = 1916,
  Setg_rm8 = 1917,
  VEX_Kmovw_kr_km16 = 1918,
  VEX_Kmovq_kr_km64 = 1919,
  VEX_Kmovb_kr_km8 = 1920,
  VEX_Kmovd_kr_km32 = 1921,
  VEX_Kmovw_m16_kr = 1922,
  VEX_Kmovq_m64_kr = 1923,
  VEX_Kmovb_m8_kr = 1924,
  VEX_Kmovd_m32_kr = 1925,
  VEX_Kmovw_kr_r32 = 1926,
  VEX_Kmovb_kr_r32 = 1927,
  VEX_Kmovd_kr_r32 = 1928,
  VEX_Kmovq_kr_r64 = 1929,
  VEX_Kmovw_r32_kr = 1930,
  VEX_Kmovb_r32_kr = 1931,
  VEX_Kmovd_r32_kr = 1932,
  VEX_Kmovq_r64_kr = 1933,
  VEX_Kortestw_kr_kr = 1934,
  VEX_Kortestq_kr_kr = 1935,
  VEX_Kortestb_kr_kr = 1936,
  VEX_Kortestd_kr_kr = 1937,
  VEX_Ktestw_kr_kr = 1938,
  VEX_Ktestq_kr_kr = 1939,
  VEX_Ktestb_kr_kr = 1940,
  VEX_Ktestd_kr_kr = 1941,
  Pushw_FS = 1942,
  Pushd_FS = 1943,
  Pushq_FS = 1944,
  Popw_FS = 1945,
  Popd_FS = 1946,
  Popq_FS = 1947,
  Cpuid = 1948,
  Bt_rm16_r16 = 1949,
  Bt_rm32_r32 = 1950,
  Bt_rm64_r64 = 1951,
  Shld_rm16_r16_imm8 = 1952,
  Shld_rm32_r32_imm8 = 1953,
  Shld_rm64_r64_imm8 = 1954,
  Shld_rm16_r16_CL = 1955,
  Shld_rm32_r32_CL = 1956,
  Shld_rm64_r64_CL = 1957,
  Montmul_16 = 1958,
  Montmul_32 = 1959,
  Montmul_64 = 1960,
  Xsha1_16 = 1961,
  Xsha1_32 = 1962,
  Xsha1_64 = 1963,
  Xsha256_16 = 1964,
  Xsha256_32 = 1965,
  Xsha256_64 = 1966,
  Xbts_r16_rm16 = 1967,
  Xbts_r32_rm32 = 1968,
  Xstore_16 = 1969,
  Xstore_32 = 1970,
  Xstore_64 = 1971,
  Xcryptecb_16 = 1972,
  Xcryptecb_32 = 1973,
  Xcryptecb_64 = 1974,
  Xcryptcbc_16 = 1975,
  Xcryptcbc_32 = 1976,
  Xcryptcbc_64 = 1977,
  Xcryptctr_16 = 1978,
  Xcryptctr_32 = 1979,
  Xcryptctr_64 = 1980,
  Xcryptcfb_16 = 1981,
  Xcryptcfb_32 = 1982,
  Xcryptcfb_64 = 1983,
  Xcryptofb_16 = 1984,
  Xcryptofb_32 = 1985,
  Xcryptofb_64 = 1986,
  Ibts_rm16_r16 = 1987,
  Ibts_rm32_r32 = 1988,
  Cmpxchg486_rm8_r8 = 1989,
  Cmpxchg486_rm16_r16 = 1990,
  Cmpxchg486_rm32_r32 = 1991,
  Pushw_GS = 1992,
  Pushd_GS = 1993,
  Pushq_GS = 1994,
  Popw_GS = 1995,
  Popd_GS = 1996,
  Popq_GS = 1997,
  Rsm = 1998,
  Bts_rm16_r16 = 1999,
  Bts_rm32_r32 = 2000,
  Bts_rm64_r64 = 2001,
  Shrd_rm16_r16_imm8 = 2002,
  Shrd_rm32_r32_imm8 = 2003,
  Shrd_rm64_r64_imm8 = 2004,
  Shrd_rm16_r16_CL = 2005,
  Shrd_rm32_r32_CL = 2006,
  Shrd_rm64_r64_CL = 2007,
  Fxsave_m512byte = 2008,
  Fxsave64_m512byte = 2009,
  Rdfsbase_r32 = 2010,
  Rdfsbase_r64 = 2011,
  Fxrstor_m512byte = 2012,
  Fxrstor64_m512byte = 2013,
  Rdgsbase_r32 = 2014,
  Rdgsbase_r64 = 2015,
  Ldmxcsr_m32 = 2016,
  Wrfsbase_r32 = 2017,
  Wrfsbase_r64 = 2018,
  VEX_Vldmxcsr_m32 = 2019,
  Stmxcsr_m32 = 2020,
  Wrgsbase_r32 = 2021,
  Wrgsbase_r64 = 2022,
  VEX_Vstmxcsr_m32 = 2023,
  Xsave_mem = 2024,
  Xsave64_mem = 2025,
  Ptwrite_rm32 = 2026,
  Ptwrite_rm64 = 2027,
  Xrstor_mem = 2028,
  Xrstor64_mem = 2029,
  Incsspd_r32 = 2030,
  Incsspq_r64 = 2031,
  Xsaveopt_mem = 2032,
  Xsaveopt64_mem = 2033,
  Clwb_m8 = 2034,
  Tpause_r32 = 2035,
  Tpause_r64 = 2036,
  Clrssbsy_m64 = 2037,
  Umonitor_r16 = 2038,
  Umonitor_r32 = 2039,
  Umonitor_r64 = 2040,
  Umwait_r32 = 2041,
  Umwait_r64 = 2042,
  Clflush_m8 = 2043,
  Clflushopt_m8 = 2044,
  Lfence = 2045,
  Lfence_E9 = 2046,
  Lfence_EA = 2047,
  Lfence_EB = 2048,
  Lfence_EC = 2049,
  Lfence_ED = 2050,
  Lfence_EE = 2051,
  Lfence_EF = 2052,
  Mfence = 2053,
  Mfence_F1 = 2054,
  Mfence_F2 = 2055,
  Mfence_F3 = 2056,
  Mfence_F4 = 2057,
  Mfence_F5 = 2058,
  Mfence_F6 = 2059,
  Mfence_F7 = 2060,
  Sfence = 2061,
  Sfence_F9 = 2062,
  Sfence_FA = 2063,
  Sfence_FB = 2064,
  Sfence_FC = 2065,
  Sfence_FD = 2066,
  Sfence_FE = 2067,
  Sfence_FF = 2068,
  Pcommit = 2069,
  Imul_r16_rm16 = 2070,
  Imul_r32_rm32 = 2071,
  Imul_r64_rm64 = 2072,
  Cmpxchg_rm8_r8 = 2073,
  Cmpxchg_rm16_r16 = 2074,
  Cmpxchg_rm32_r32 = 2075,
  Cmpxchg_rm64_r64 = 2076,
  Lss_r16_m1616 = 2077,
  Lss_r32_m1632 = 2078,
  Lss_r64_m1664 = 2079,
  Btr_rm16_r16 = 2080,
  Btr_rm32_r32 = 2081,
  Btr_rm64_r64 = 2082,
  Lfs_r16_m1616 = 2083,
  Lfs_r32_m1632 = 2084,
  Lfs_r64_m1664 = 2085,
  Lgs_r16_m1616 = 2086,
  Lgs_r32_m1632 = 2087,
  Lgs_r64_m1664 = 2088,
  Movzx_r16_rm8 = 2089,
  Movzx_r32_rm8 = 2090,
  Movzx_r64_rm8 = 2091,
  Movzx_r16_rm16 = 2092,
  Movzx_r32_rm16 = 2093,
  Movzx_r64_rm16 = 2094,
  Jmpe_disp16 = 2095,
  Jmpe_disp32 = 2096,
  Popcnt_r16_rm16 = 2097,
  Popcnt_r32_rm32 = 2098,
  Popcnt_r64_rm64 = 2099,
  Ud1_r16_rm16 = 2100,
  Ud1_r32_rm32 = 2101,
  Ud1_r64_rm64 = 2102,
  Bt_rm16_imm8 = 2103,
  Bt_rm32_imm8 = 2104,
  Bt_rm64_imm8 = 2105,
  Bts_rm16_imm8 = 2106,
  Bts_rm32_imm8 = 2107,
  Bts_rm64_imm8 = 2108,
  Btr_rm16_imm8 = 2109,
  Btr_rm32_imm8 = 2110,
  Btr_rm64_imm8 = 2111,
  Btc_rm16_imm8 = 2112,
  Btc_rm32_imm8 = 2113,
  Btc_rm64_imm8 = 2114,
  Btc_rm16_r16 = 2115,
  Btc_rm32_r32 = 2116,
  Btc_rm64_r64 = 2117,
  Bsf_r16_rm16 = 2118,
  Bsf_r32_rm32 = 2119,
  Bsf_r64_rm64 = 2120,
  Tzcnt_r16_rm16 = 2121,
  Tzcnt_r32_rm32 = 2122,
  Tzcnt_r64_rm64 = 2123,
  Bsr_r16_rm16 = 2124,
  Bsr_r32_rm32 = 2125,
  Bsr_r64_rm64 = 2126,
  Lzcnt_r16_rm16 = 2127,
  Lzcnt_r32_rm32 = 2128,
  Lzcnt_r64_rm64 = 2129,
  Movsx_r16_rm8 = 2130,
  Movsx_r32_rm8 = 2131,
  Movsx_r64_rm8 = 2132,
  Movsx_r16_rm16 = 2133,
  Movsx_r32_rm16 = 2134,
  Movsx_r64_rm16 = 2135,
  Xadd_rm8_r8 = 2136,
  Xadd_rm16_r16 = 2137,
  Xadd_rm32_r32 = 2138,
  Xadd_rm64_r64 = 2139,
  Cmpps_xmm_xmmm128_imm8 = 2140,
  VEX_Vcmpps_xmm_xmm_xmmm128_imm8 = 2141,
  VEX_Vcmpps_ymm_ymm_ymmm256_imm8 = 2142,
  EVEX_Vcmpps_kr_k1_xmm_xmmm128b32_imm8 = 2143,
  EVEX_Vcmpps_kr_k1_ymm_ymmm256b32_imm8 = 2144,
  EVEX_Vcmpps_kr_k1_zmm_zmmm512b32_imm8_sae = 2145,
  Cmppd_xmm_xmmm128_imm8 = 2146,
  VEX_Vcmppd_xmm_xmm_xmmm128_imm8 = 2147,
  VEX_Vcmppd_ymm_ymm_ymmm256_imm8 = 2148,
  EVEX_Vcmppd_kr_k1_xmm_xmmm128b64_imm8 = 2149,
  EVEX_Vcmppd_kr_k1_ymm_ymmm256b64_imm8 = 2150,
  EVEX_Vcmppd_kr_k1_zmm_zmmm512b64_imm8_sae = 2151,
  Cmpss_xmm_xmmm32_imm8 = 2152,
  VEX_Vcmpss_xmm_xmm_xmmm32_imm8 = 2153,
  EVEX_Vcmpss_kr_k1_xmm_xmmm32_imm8_sae = 2154,
  Cmpsd_xmm_xmmm64_imm8 = 2155,
  VEX_Vcmpsd_xmm_xmm_xmmm64_imm8 = 2156,
  EVEX_Vcmpsd_kr_k1_xmm_xmmm64_imm8_sae = 2157,
  Movnti_m32_r32 = 2158,
  Movnti_m64_r64 = 2159,
  Pinsrw_mm_r32m16_imm8 = 2160,
  Pinsrw_mm_r64m16_imm8 = 2161,
  Pinsrw_xmm_r32m16_imm8 = 2162,
  Pinsrw_xmm_r64m16_imm8 = 2163,
  VEX_Vpinsrw_xmm_xmm_r32m16_imm8 = 2164,
  VEX_Vpinsrw_xmm_xmm_r64m16_imm8 = 2165,
  EVEX_Vpinsrw_xmm_xmm_r32m16_imm8 = 2166,
  EVEX_Vpinsrw_xmm_xmm_r64m16_imm8 = 2167,
  Pextrw_r32_mm_imm8 = 2168,
  Pextrw_r64_mm_imm8 = 2169,
  Pextrw_r32_xmm_imm8 = 2170,
  Pextrw_r64_xmm_imm8 = 2171,
  VEX_Vpextrw_r32_xmm_imm8 = 2172,
  VEX_Vpextrw_r64_xmm_imm8 = 2173,
  EVEX_Vpextrw_r32_xmm_imm8 = 2174,
  EVEX_Vpextrw_r64_xmm_imm8 = 2175,
  Shufps_xmm_xmmm128_imm8 = 2176,
  VEX_Vshufps_xmm_xmm_xmmm128_imm8 = 2177,
  VEX_Vshufps_ymm_ymm_ymmm256_imm8 = 2178,
  EVEX_Vshufps_xmm_k1z_xmm_xmmm128b32_imm8 = 2179,
  EVEX_Vshufps_ymm_k1z_ymm_ymmm256b32_imm8 = 2180,
  EVEX_Vshufps_zmm_k1z_zmm_zmmm512b32_imm8 = 2181,
  Shufpd_xmm_xmmm128_imm8 = 2182,
  VEX_Vshufpd_xmm_xmm_xmmm128_imm8 = 2183,
  VEX_Vshufpd_ymm_ymm_ymmm256_imm8 = 2184,
  EVEX_Vshufpd_xmm_k1z_xmm_xmmm128b64_imm8 = 2185,
  EVEX_Vshufpd_ymm_k1z_ymm_ymmm256b64_imm8 = 2186,
  EVEX_Vshufpd_zmm_k1z_zmm_zmmm512b64_imm8 = 2187,
  Cmpxchg8b_m64 = 2188,
  Cmpxchg16b_m128 = 2189,
  Xrstors_mem = 2190,
  Xrstors64_mem = 2191,
  Xsavec_mem = 2192,
  Xsavec64_mem = 2193,
  Xsaves_mem = 2194,
  Xsaves64_mem = 2195,
  Vmptrld_m64 = 2196,
  Vmclear_m64 = 2197,
  Vmxon_m64 = 2198,
  Rdrand_r16 = 2199,
  Rdrand_r32 = 2200,
  Rdrand_r64 = 2201,
  Vmptrst_m64 = 2202,
  Rdseed_r16 = 2203,
  Rdseed_r32 = 2204,
  Rdseed_r64 = 2205,
  Rdpid_r32 = 2206,
  Rdpid_r64 = 2207,
  Bswap_r16 = 2208,
  Bswap_r32 = 2209,
  Bswap_r64 = 2210,
  Addsubpd_xmm_xmmm128 = 2211,
  VEX_Vaddsubpd_xmm_xmm_xmmm128 = 2212,
  VEX_Vaddsubpd_ymm_ymm_ymmm256 = 2213,
  Addsubps_xmm_xmmm128 = 2214,
  VEX_Vaddsubps_xmm_xmm_xmmm128 = 2215,
  VEX_Vaddsubps_ymm_ymm_ymmm256 = 2216,
  Psrlw_mm_mmm64 = 2217,
  Psrlw_xmm_xmmm128 = 2218,
  VEX_Vpsrlw_xmm_xmm_xmmm128 = 2219,
  VEX_Vpsrlw_ymm_ymm_xmmm128 = 2220,
  EVEX_Vpsrlw_xmm_k1z_xmm_xmmm128 = 2221,
  EVEX_Vpsrlw_ymm_k1z_ymm_xmmm128 = 2222,
  EVEX_Vpsrlw_zmm_k1z_zmm_xmmm128 = 2223,
  Psrld_mm_mmm64 = 2224,
  Psrld_xmm_xmmm128 = 2225,
  VEX_Vpsrld_xmm_xmm_xmmm128 = 2226,
  VEX_Vpsrld_ymm_ymm_xmmm128 = 2227,
  EVEX_Vpsrld_xmm_k1z_xmm_xmmm128 = 2228,
  EVEX_Vpsrld_ymm_k1z_ymm_xmmm128 = 2229,
  EVEX_Vpsrld_zmm_k1z_zmm_xmmm128 = 2230,
  Psrlq_mm_mmm64 = 2231,
  Psrlq_xmm_xmmm128 = 2232,
  VEX_Vpsrlq_xmm_xmm_xmmm128 = 2233,
  VEX_Vpsrlq_ymm_ymm_xmmm128 = 2234,
  EVEX_Vpsrlq_xmm_k1z_xmm_xmmm128 = 2235,
  EVEX_Vpsrlq_ymm_k1z_ymm_xmmm128 = 2236,
  EVEX_Vpsrlq_zmm_k1z_zmm_xmmm128 = 2237,
  Paddq_mm_mmm64 = 2238,
  Paddq_xmm_xmmm128 = 2239,
  VEX_Vpaddq_xmm_xmm_xmmm128 = 2240,
  VEX_Vpaddq_ymm_ymm_ymmm256 = 2241,
  EVEX_Vpaddq_xmm_k1z_xmm_xmmm128b64 = 2242,
  EVEX_Vpaddq_ymm_k1z_ymm_ymmm256b64 = 2243,
  EVEX_Vpaddq_zmm_k1z_zmm_zmmm512b64 = 2244,
  Pmullw_mm_mmm64 = 2245,
  Pmullw_xmm_xmmm128 = 2246,
  VEX_Vpmullw_xmm_xmm_xmmm128 = 2247,
  VEX_Vpmullw_ymm_ymm_ymmm256 = 2248,
  EVEX_Vpmullw_xmm_k1z_xmm_xmmm128 = 2249,
  EVEX_Vpmullw_ymm_k1z_ymm_ymmm256 = 2250,
  EVEX_Vpmullw_zmm_k1z_zmm_zmmm512 = 2251,
  Movq_xmmm64_xmm = 2252,
  VEX_Vmovq_xmmm64_xmm = 2253,
  EVEX_Vmovq_xmmm64_xmm = 2254,
  Movq2dq_xmm_mm = 2255,
  Movdq2q_mm_xmm = 2256,
  Pmovmskb_r32_mm = 2257,
  Pmovmskb_r64_mm = 2258,
  Pmovmskb_r32_xmm = 2259,
  Pmovmskb_r64_xmm = 2260,
  VEX_Vpmovmskb_r32_xmm = 2261,
  VEX_Vpmovmskb_r64_xmm = 2262,
  VEX_Vpmovmskb_r32_ymm = 2263,
  VEX_Vpmovmskb_r64_ymm = 2264,
  Psubusb_mm_mmm64 = 2265,
  Psubusb_xmm_xmmm128 = 2266,
  VEX_Vpsubusb_xmm_xmm_xmmm128 = 2267,
  VEX_Vpsubusb_ymm_ymm_ymmm256 = 2268,
  EVEX_Vpsubusb_xmm_k1z_xmm_xmmm128 = 2269,
  EVEX_Vpsubusb_ymm_k1z_ymm_ymmm256 = 2270,
  EVEX_Vpsubusb_zmm_k1z_zmm_zmmm512 = 2271,
  Psubusw_mm_mmm64 = 2272,
  Psubusw_xmm_xmmm128 = 2273,
  VEX_Vpsubusw_xmm_xmm_xmmm128 = 2274,
  VEX_Vpsubusw_ymm_ymm_ymmm256 = 2275,
  EVEX_Vpsubusw_xmm_k1z_xmm_xmmm128 = 2276,
  EVEX_Vpsubusw_ymm_k1z_ymm_ymmm256 = 2277,
  EVEX_Vpsubusw_zmm_k1z_zmm_zmmm512 = 2278,
  Pminub_mm_mmm64 = 2279,
  Pminub_xmm_xmmm128 = 2280,
  VEX_Vpminub_xmm_xmm_xmmm128 = 2281,
  VEX_Vpminub_ymm_ymm_ymmm256 = 2282,
  EVEX_Vpminub_xmm_k1z_xmm_xmmm128 = 2283,
  EVEX_Vpminub_ymm_k1z_ymm_ymmm256 = 2284,
  EVEX_Vpminub_zmm_k1z_zmm_zmmm512 = 2285,
  Pand_mm_mmm64 = 2286,
  Pand_xmm_xmmm128 = 2287,
  VEX_Vpand_xmm_xmm_xmmm128 = 2288,
  VEX_Vpand_ymm_ymm_ymmm256 = 2289,
  EVEX_Vpandd_xmm_k1z_xmm_xmmm128b32 = 2290,
  EVEX_Vpandd_ymm_k1z_ymm_ymmm256b32 = 2291,
  EVEX_Vpandd_zmm_k1z_zmm_zmmm512b32 = 2292,
  EVEX_Vpandq_xmm_k1z_xmm_xmmm128b64 = 2293,
  EVEX_Vpandq_ymm_k1z_ymm_ymmm256b64 = 2294,
  EVEX_Vpandq_zmm_k1z_zmm_zmmm512b64 = 2295,
  Paddusb_mm_mmm64 = 2296,
  Paddusb_xmm_xmmm128 = 2297,
  VEX_Vpaddusb_xmm_xmm_xmmm128 = 2298,
  VEX_Vpaddusb_ymm_ymm_ymmm256 = 2299,
  EVEX_Vpaddusb_xmm_k1z_xmm_xmmm128 = 2300,
  EVEX_Vpaddusb_ymm_k1z_ymm_ymmm256 = 2301,
  EVEX_Vpaddusb_zmm_k1z_zmm_zmmm512 = 2302,
  Paddusw_mm_mmm64 = 2303,
  Paddusw_xmm_xmmm128 = 2304,
  VEX_Vpaddusw_xmm_xmm_xmmm128 = 2305,
  VEX_Vpaddusw_ymm_ymm_ymmm256 = 2306,
  EVEX_Vpaddusw_xmm_k1z_xmm_xmmm128 = 2307,
  EVEX_Vpaddusw_ymm_k1z_ymm_ymmm256 = 2308,
  EVEX_Vpaddusw_zmm_k1z_zmm_zmmm512 = 2309,
  Pmaxub_mm_mmm64 = 2310,
  Pmaxub_xmm_xmmm128 = 2311,
  VEX_Vpmaxub_xmm_xmm_xmmm128 = 2312,
  VEX_Vpmaxub_ymm_ymm_ymmm256 = 2313,
  EVEX_Vpmaxub_xmm_k1z_xmm_xmmm128 = 2314,
  EVEX_Vpmaxub_ymm_k1z_ymm_ymmm256 = 2315,
  EVEX_Vpmaxub_zmm_k1z_zmm_zmmm512 = 2316,
  Pandn_mm_mmm64 = 2317,
  Pandn_xmm_xmmm128 = 2318,
  VEX_Vpandn_xmm_xmm_xmmm128 = 2319,
  VEX_Vpandn_ymm_ymm_ymmm256 = 2320,
  EVEX_Vpandnd_xmm_k1z_xmm_xmmm128b32 = 2321,
  EVEX_Vpandnd_ymm_k1z_ymm_ymmm256b32 = 2322,
  EVEX_Vpandnd_zmm_k1z_zmm_zmmm512b32 = 2323,
  EVEX_Vpandnq_xmm_k1z_xmm_xmmm128b64 = 2324,
  EVEX_Vpandnq_ymm_k1z_ymm_ymmm256b64 = 2325,
  EVEX_Vpandnq_zmm_k1z_zmm_zmmm512b64 = 2326,
  Pavgb_mm_mmm64 = 2327,
  Pavgb_xmm_xmmm128 = 2328,
  VEX_Vpavgb_xmm_xmm_xmmm128 = 2329,
  VEX_Vpavgb_ymm_ymm_ymmm256 = 2330,
  EVEX_Vpavgb_xmm_k1z_xmm_xmmm128 = 2331,
  EVEX_Vpavgb_ymm_k1z_ymm_ymmm256 = 2332,
  EVEX_Vpavgb_zmm_k1z_zmm_zmmm512 = 2333,
  Psraw_mm_mmm64 = 2334,
  Psraw_xmm_xmmm128 = 2335,
  VEX_Vpsraw_xmm_xmm_xmmm128 = 2336,
  VEX_Vpsraw_ymm_ymm_xmmm128 = 2337,
  EVEX_Vpsraw_xmm_k1z_xmm_xmmm128 = 2338,
  EVEX_Vpsraw_ymm_k1z_ymm_xmmm128 = 2339,
  EVEX_Vpsraw_zmm_k1z_zmm_xmmm128 = 2340,
  Psrad_mm_mmm64 = 2341,
  Psrad_xmm_xmmm128 = 2342,
  VEX_Vpsrad_xmm_xmm_xmmm128 = 2343,
  VEX_Vpsrad_ymm_ymm_xmmm128 = 2344,
  EVEX_Vpsrad_xmm_k1z_xmm_xmmm128 = 2345,
  EVEX_Vpsrad_ymm_k1z_ymm_xmmm128 = 2346,
  EVEX_Vpsrad_zmm_k1z_zmm_xmmm128 = 2347,
  EVEX_Vpsraq_xmm_k1z_xmm_xmmm128 = 2348,
  EVEX_Vpsraq_ymm_k1z_ymm_xmmm128 = 2349,
  EVEX_Vpsraq_zmm_k1z_zmm_xmmm128 = 2350,
  Pavgw_mm_mmm64 = 2351,
  Pavgw_xmm_xmmm128 = 2352,
  VEX_Vpavgw_xmm_xmm_xmmm128 = 2353,
  VEX_Vpavgw_ymm_ymm_ymmm256 = 2354,
  EVEX_Vpavgw_xmm_k1z_xmm_xmmm128 = 2355,
  EVEX_Vpavgw_ymm_k1z_ymm_ymmm256 = 2356,
  EVEX_Vpavgw_zmm_k1z_zmm_zmmm512 = 2357,
  Pmulhuw_mm_mmm64 = 2358,
  Pmulhuw_xmm_xmmm128 = 2359,
  VEX_Vpmulhuw_xmm_xmm_xmmm128 = 2360,
  VEX_Vpmulhuw_ymm_ymm_ymmm256 = 2361,
  EVEX_Vpmulhuw_xmm_k1z_xmm_xmmm128 = 2362,
  EVEX_Vpmulhuw_ymm_k1z_ymm_ymmm256 = 2363,
  EVEX_Vpmulhuw_zmm_k1z_zmm_zmmm512 = 2364,
  Pmulhw_mm_mmm64 = 2365,
  Pmulhw_xmm_xmmm128 = 2366,
  VEX_Vpmulhw_xmm_xmm_xmmm128 = 2367,
  VEX_Vpmulhw_ymm_ymm_ymmm256 = 2368,
  EVEX_Vpmulhw_xmm_k1z_xmm_xmmm128 = 2369,
  EVEX_Vpmulhw_ymm_k1z_ymm_ymmm256 = 2370,
  EVEX_Vpmulhw_zmm_k1z_zmm_zmmm512 = 2371,
  Cvttpd2dq_xmm_xmmm128 = 2372,
  VEX_Vcvttpd2dq_xmm_xmmm128 = 2373,
  VEX_Vcvttpd2dq_xmm_ymmm256 = 2374,
  EVEX_Vcvttpd2dq_xmm_k1z_xmmm128b64 = 2375,
  EVEX_Vcvttpd2dq_xmm_k1z_ymmm256b64 = 2376,
  EVEX_Vcvttpd2dq_ymm_k1z_zmmm512b64_sae = 2377,
  Cvtdq2pd_xmm_xmmm64 = 2378,
  VEX_Vcvtdq2pd_xmm_xmmm64 = 2379,
  VEX_Vcvtdq2pd_ymm_xmmm128 = 2380,
  EVEX_Vcvtdq2pd_xmm_k1z_xmmm64b32 = 2381,
  EVEX_Vcvtdq2pd_ymm_k1z_xmmm128b32 = 2382,
  EVEX_Vcvtdq2pd_zmm_k1z_ymmm256b32_er = 2383,
  EVEX_Vcvtqq2pd_xmm_k1z_xmmm128b64 = 2384,
  EVEX_Vcvtqq2pd_ymm_k1z_ymmm256b64 = 2385,
  EVEX_Vcvtqq2pd_zmm_k1z_zmmm512b64_er = 2386,
  Cvtpd2dq_xmm_xmmm128 = 2387,
  VEX_Vcvtpd2dq_xmm_xmmm128 = 2388,
  VEX_Vcvtpd2dq_xmm_ymmm256 = 2389,
  EVEX_Vcvtpd2dq_xmm_k1z_xmmm128b64 = 2390,
  EVEX_Vcvtpd2dq_xmm_k1z_ymmm256b64 = 2391,
  EVEX_Vcvtpd2dq_ymm_k1z_zmmm512b64_er = 2392,
  Movntq_m64_mm = 2393,
  Movntdq_m128_xmm = 2394,
  VEX_Vmovntdq_m128_xmm = 2395,
  VEX_Vmovntdq_m256_ymm = 2396,
  EVEX_Vmovntdq_m128_xmm = 2397,
  EVEX_Vmovntdq_m256_ymm = 2398,
  EVEX_Vmovntdq_m512_zmm = 2399,
  Psubsb_mm_mmm64 = 2400,
  Psubsb_xmm_xmmm128 = 2401,
  VEX_Vpsubsb_xmm_xmm_xmmm128 = 2402,
  VEX_Vpsubsb_ymm_ymm_ymmm256 = 2403,
  EVEX_Vpsubsb_xmm_k1z_xmm_xmmm128 = 2404,
  EVEX_Vpsubsb_ymm_k1z_ymm_ymmm256 = 2405,
  EVEX_Vpsubsb_zmm_k1z_zmm_zmmm512 = 2406,
  Psubsw_mm_mmm64 = 2407,
  Psubsw_xmm_xmmm128 = 2408,
  VEX_Vpsubsw_xmm_xmm_xmmm128 = 2409,
  VEX_Vpsubsw_ymm_ymm_ymmm256 = 2410,
  EVEX_Vpsubsw_xmm_k1z_xmm_xmmm128 = 2411,
  EVEX_Vpsubsw_ymm_k1z_ymm_ymmm256 = 2412,
  EVEX_Vpsubsw_zmm_k1z_zmm_zmmm512 = 2413,
  Pminsw_mm_mmm64 = 2414,
  Pminsw_xmm_xmmm128 = 2415,
  VEX_Vpminsw_xmm_xmm_xmmm128 = 2416,
  VEX_Vpminsw_ymm_ymm_ymmm256 = 2417,
  EVEX_Vpminsw_xmm_k1z_xmm_xmmm128 = 2418,
  EVEX_Vpminsw_ymm_k1z_ymm_ymmm256 = 2419,
  EVEX_Vpminsw_zmm_k1z_zmm_zmmm512 = 2420,
  Por_mm_mmm64 = 2421,
  Por_xmm_xmmm128 = 2422,
  VEX_Vpor_xmm_xmm_xmmm128 = 2423,
  VEX_Vpor_ymm_ymm_ymmm256 = 2424,
  EVEX_Vpord_xmm_k1z_xmm_xmmm128b32 = 2425,
  EVEX_Vpord_ymm_k1z_ymm_ymmm256b32 = 2426,
  EVEX_Vpord_zmm_k1z_zmm_zmmm512b32 = 2427,
  EVEX_Vporq_xmm_k1z_xmm_xmmm128b64 = 2428,
  EVEX_Vporq_ymm_k1z_ymm_ymmm256b64 = 2429,
  EVEX_Vporq_zmm_k1z_zmm_zmmm512b64 = 2430,
  Paddsb_mm_mmm64 = 2431,
  Paddsb_xmm_xmmm128 = 2432,
  VEX_Vpaddsb_xmm_xmm_xmmm128 = 2433,
  VEX_Vpaddsb_ymm_ymm_ymmm256 = 2434,
  EVEX_Vpaddsb_xmm_k1z_xmm_xmmm128 = 2435,
  EVEX_Vpaddsb_ymm_k1z_ymm_ymmm256 = 2436,
  EVEX_Vpaddsb_zmm_k1z_zmm_zmmm512 = 2437,
  Paddsw_mm_mmm64 = 2438,
  Paddsw_xmm_xmmm128 = 2439,
  VEX_Vpaddsw_xmm_xmm_xmmm128 = 2440,
  VEX_Vpaddsw_ymm_ymm_ymmm256 = 2441,
  EVEX_Vpaddsw_xmm_k1z_xmm_xmmm128 = 2442,
  EVEX_Vpaddsw_ymm_k1z_ymm_ymmm256 = 2443,
  EVEX_Vpaddsw_zmm_k1z_zmm_zmmm512 = 2444,
  Pmaxsw_mm_mmm64 = 2445,
  Pmaxsw_xmm_xmmm128 = 2446,
  VEX_Vpmaxsw_xmm_xmm_xmmm128 = 2447,
  VEX_Vpmaxsw_ymm_ymm_ymmm256 = 2448,
  EVEX_Vpmaxsw_xmm_k1z_xmm_xmmm128 = 2449,
  EVEX_Vpmaxsw_ymm_k1z_ymm_ymmm256 = 2450,
  EVEX_Vpmaxsw_zmm_k1z_zmm_zmmm512 = 2451,
  Pxor_mm_mmm64 = 2452,
  Pxor_xmm_xmmm128 = 2453,
  VEX_Vpxor_xmm_xmm_xmmm128 = 2454,
  VEX_Vpxor_ymm_ymm_ymmm256 = 2455,
  EVEX_Vpxord_xmm_k1z_xmm_xmmm128b32 = 2456,
  EVEX_Vpxord_ymm_k1z_ymm_ymmm256b32 = 2457,
  EVEX_Vpxord_zmm_k1z_zmm_zmmm512b32 = 2458,
  EVEX_Vpxorq_xmm_k1z_xmm_xmmm128b64 = 2459,
  EVEX_Vpxorq_ymm_k1z_ymm_ymmm256b64 = 2460,
  EVEX_Vpxorq_zmm_k1z_zmm_zmmm512b64 = 2461,
  Lddqu_xmm_m128 = 2462,
  VEX_Vlddqu_xmm_m128 = 2463,
  VEX_Vlddqu_ymm_m256 = 2464,
  Psllw_mm_mmm64 = 2465,
  Psllw_xmm_xmmm128 = 2466,
  VEX_Vpsllw_xmm_xmm_xmmm128 = 2467,
  VEX_Vpsllw_ymm_ymm_xmmm128 = 2468,
  EVEX_Vpsllw_xmm_k1z_xmm_xmmm128 = 2469,
  EVEX_Vpsllw_ymm_k1z_ymm_xmmm128 = 2470,
  EVEX_Vpsllw_zmm_k1z_zmm_xmmm128 = 2471,
  Pslld_mm_mmm64 = 2472,
  Pslld_xmm_xmmm128 = 2473,
  VEX_Vpslld_xmm_xmm_xmmm128 = 2474,
  VEX_Vpslld_ymm_ymm_xmmm128 = 2475,
  EVEX_Vpslld_xmm_k1z_xmm_xmmm128 = 2476,
  EVEX_Vpslld_ymm_k1z_ymm_xmmm128 = 2477,
  EVEX_Vpslld_zmm_k1z_zmm_xmmm128 = 2478,
  Psllq_mm_mmm64 = 2479,
  Psllq_xmm_xmmm128 = 2480,
  VEX_Vpsllq_xmm_xmm_xmmm128 = 2481,
  VEX_Vpsllq_ymm_ymm_xmmm128 = 2482,
  EVEX_Vpsllq_xmm_k1z_xmm_xmmm128 = 2483,
  EVEX_Vpsllq_ymm_k1z_ymm_xmmm128 = 2484,
  EVEX_Vpsllq_zmm_k1z_zmm_xmmm128 = 2485,
  Pmuludq_mm_mmm64 = 2486,
  Pmuludq_xmm_xmmm128 = 2487,
  VEX_Vpmuludq_xmm_xmm_xmmm128 = 2488,
  VEX_Vpmuludq_ymm_ymm_ymmm256 = 2489,
  EVEX_Vpmuludq_xmm_k1z_xmm_xmmm128b64 = 2490,
  EVEX_Vpmuludq_ymm_k1z_ymm_ymmm256b64 = 2491,
  EVEX_Vpmuludq_zmm_k1z_zmm_zmmm512b64 = 2492,
  Pmaddwd_mm_mmm64 = 2493,
  Pmaddwd_xmm_xmmm128 = 2494,
  VEX_Vpmaddwd_xmm_xmm_xmmm128 = 2495,
  VEX_Vpmaddwd_ymm_ymm_ymmm256 = 2496,
  EVEX_Vpmaddwd_xmm_k1z_xmm_xmmm128 = 2497,
  EVEX_Vpmaddwd_ymm_k1z_ymm_ymmm256 = 2498,
  EVEX_Vpmaddwd_zmm_k1z_zmm_zmmm512 = 2499,
  Psadbw_mm_mmm64 = 2500,
  Psadbw_xmm_xmmm128 = 2501,
  VEX_Vpsadbw_xmm_xmm_xmmm128 = 2502,
  VEX_Vpsadbw_ymm_ymm_ymmm256 = 2503,
  EVEX_Vpsadbw_xmm_xmm_xmmm128 = 2504,
  EVEX_Vpsadbw_ymm_ymm_ymmm256 = 2505,
  EVEX_Vpsadbw_zmm_zmm_zmmm512 = 2506,
  Maskmovq_rDI_mm_mm = 2507,
  Maskmovdqu_rDI_xmm_xmm = 2508,
  VEX_Vmaskmovdqu_rDI_xmm_xmm = 2509,
  Psubb_mm_mmm64 = 2510,
  Psubb_xmm_xmmm128 = 2511,
  VEX_Vpsubb_xmm_xmm_xmmm128 = 2512,
  VEX_Vpsubb_ymm_ymm_ymmm256 = 2513,
  EVEX_Vpsubb_xmm_k1z_xmm_xmmm128 = 2514,
  EVEX_Vpsubb_ymm_k1z_ymm_ymmm256 = 2515,
  EVEX_Vpsubb_zmm_k1z_zmm_zmmm512 = 2516,
  Psubw_mm_mmm64 = 2517,
  Psubw_xmm_xmmm128 = 2518,
  VEX_Vpsubw_xmm_xmm_xmmm128 = 2519,
  VEX_Vpsubw_ymm_ymm_ymmm256 = 2520,
  EVEX_Vpsubw_xmm_k1z_xmm_xmmm128 = 2521,
  EVEX_Vpsubw_ymm_k1z_ymm_ymmm256 = 2522,
  EVEX_Vpsubw_zmm_k1z_zmm_zmmm512 = 2523,
  Psubd_mm_mmm64 = 2524,
  Psubd_xmm_xmmm128 = 2525,
  VEX_Vpsubd_xmm_xmm_xmmm128 = 2526,
  VEX_Vpsubd_ymm_ymm_ymmm256 = 2527,
  EVEX_Vpsubd_xmm_k1z_xmm_xmmm128b32 = 2528,
  EVEX_Vpsubd_ymm_k1z_ymm_ymmm256b32 = 2529,
  EVEX_Vpsubd_zmm_k1z_zmm_zmmm512b32 = 2530,
  Psubq_mm_mmm64 = 2531,
  Psubq_xmm_xmmm128 = 2532,
  VEX_Vpsubq_xmm_xmm_xmmm128 = 2533,
  VEX_Vpsubq_ymm_ymm_ymmm256 = 2534,
  EVEX_Vpsubq_xmm_k1z_xmm_xmmm128b64 = 2535,
  EVEX_Vpsubq_ymm_k1z_ymm_ymmm256b64 = 2536,
  EVEX_Vpsubq_zmm_k1z_zmm_zmmm512b64 = 2537,
  Paddb_mm_mmm64 = 2538,
  Paddb_xmm_xmmm128 = 2539,
  VEX_Vpaddb_xmm_xmm_xmmm128 = 2540,
  VEX_Vpaddb_ymm_ymm_ymmm256 = 2541,
  EVEX_Vpaddb_xmm_k1z_xmm_xmmm128 = 2542,
  EVEX_Vpaddb_ymm_k1z_ymm_ymmm256 = 2543,
  EVEX_Vpaddb_zmm_k1z_zmm_zmmm512 = 2544,
  Paddw_mm_mmm64 = 2545,
  Paddw_xmm_xmmm128 = 2546,
  VEX_Vpaddw_xmm_xmm_xmmm128 = 2547,
  VEX_Vpaddw_ymm_ymm_ymmm256 = 2548,
  EVEX_Vpaddw_xmm_k1z_xmm_xmmm128 = 2549,
  EVEX_Vpaddw_ymm_k1z_ymm_ymmm256 = 2550,
  EVEX_Vpaddw_zmm_k1z_zmm_zmmm512 = 2551,
  Paddd_mm_mmm64 = 2552,
  Paddd_xmm_xmmm128 = 2553,
  VEX_Vpaddd_xmm_xmm_xmmm128 = 2554,
  VEX_Vpaddd_ymm_ymm_ymmm256 = 2555,
  EVEX_Vpaddd_xmm_k1z_xmm_xmmm128b32 = 2556,
  EVEX_Vpaddd_ymm_k1z_ymm_ymmm256b32 = 2557,
  EVEX_Vpaddd_zmm_k1z_zmm_zmmm512b32 = 2558,
  Ud0_r16_rm16 = 2559,
  Ud0_r32_rm32 = 2560,
  Ud0_r64_rm64 = 2561,
  Pshufb_mm_mmm64 = 2562,
  Pshufb_xmm_xmmm128 = 2563,
  VEX_Vpshufb_xmm_xmm_xmmm128 = 2564,
  VEX_Vpshufb_ymm_ymm_ymmm256 = 2565,
  EVEX_Vpshufb_xmm_k1z_xmm_xmmm128 = 2566,
  EVEX_Vpshufb_ymm_k1z_ymm_ymmm256 = 2567,
  EVEX_Vpshufb_zmm_k1z_zmm_zmmm512 = 2568,
  Phaddw_mm_mmm64 = 2569,
  Phaddw_xmm_xmmm128 = 2570,
  VEX_Vphaddw_xmm_xmm_xmmm128 = 2571,
  VEX_Vphaddw_ymm_ymm_ymmm256 = 2572,
  Phaddd_mm_mmm64 = 2573,
  Phaddd_xmm_xmmm128 = 2574,
  VEX_Vphaddd_xmm_xmm_xmmm128 = 2575,
  VEX_Vphaddd_ymm_ymm_ymmm256 = 2576,
  Phaddsw_mm_mmm64 = 2577,
  Phaddsw_xmm_xmmm128 = 2578,
  VEX_Vphaddsw_xmm_xmm_xmmm128 = 2579,
  VEX_Vphaddsw_ymm_ymm_ymmm256 = 2580,
  Pmaddubsw_mm_mmm64 = 2581,
  Pmaddubsw_xmm_xmmm128 = 2582,
  VEX_Vpmaddubsw_xmm_xmm_xmmm128 = 2583,
  VEX_Vpmaddubsw_ymm_ymm_ymmm256 = 2584,
  EVEX_Vpmaddubsw_xmm_k1z_xmm_xmmm128 = 2585,
  EVEX_Vpmaddubsw_ymm_k1z_ymm_ymmm256 = 2586,
  EVEX_Vpmaddubsw_zmm_k1z_zmm_zmmm512 = 2587,
  Phsubw_mm_mmm64 = 2588,
  Phsubw_xmm_xmmm128 = 2589,
  VEX_Vphsubw_xmm_xmm_xmmm128 = 2590,
  VEX_Vphsubw_ymm_ymm_ymmm256 = 2591,
  Phsubd_mm_mmm64 = 2592,
  Phsubd_xmm_xmmm128 = 2593,
  VEX_Vphsubd_xmm_xmm_xmmm128 = 2594,
  VEX_Vphsubd_ymm_ymm_ymmm256 = 2595,
  Phsubsw_mm_mmm64 = 2596,
  Phsubsw_xmm_xmmm128 = 2597,
  VEX_Vphsubsw_xmm_xmm_xmmm128 = 2598,
  VEX_Vphsubsw_ymm_ymm_ymmm256 = 2599,
  Psignb_mm_mmm64 = 2600,
  Psignb_xmm_xmmm128 = 2601,
  VEX_Vpsignb_xmm_xmm_xmmm128 = 2602,
  VEX_Vpsignb_ymm_ymm_ymmm256 = 2603,
  Psignw_mm_mmm64 = 2604,
  Psignw_xmm_xmmm128 = 2605,
  VEX_Vpsignw_xmm_xmm_xmmm128 = 2606,
  VEX_Vpsignw_ymm_ymm_ymmm256 = 2607,
  Psignd_mm_mmm64 = 2608,
  Psignd_xmm_xmmm128 = 2609,
  VEX_Vpsignd_xmm_xmm_xmmm128 = 2610,
  VEX_Vpsignd_ymm_ymm_ymmm256 = 2611,
  Pmulhrsw_mm_mmm64 = 2612,
  Pmulhrsw_xmm_xmmm128 = 2613,
  VEX_Vpmulhrsw_xmm_xmm_xmmm128 = 2614,
  VEX_Vpmulhrsw_ymm_ymm_ymmm256 = 2615,
  EVEX_Vpmulhrsw_xmm_k1z_xmm_xmmm128 = 2616,
  EVEX_Vpmulhrsw_ymm_k1z_ymm_ymmm256 = 2617,
  EVEX_Vpmulhrsw_zmm_k1z_zmm_zmmm512 = 2618,
  VEX_Vpermilps_xmm_xmm_xmmm128 = 2619,
  VEX_Vpermilps_ymm_ymm_ymmm256 = 2620,
  EVEX_Vpermilps_xmm_k1z_xmm_xmmm128b32 = 2621,
  EVEX_Vpermilps_ymm_k1z_ymm_ymmm256b32 = 2622,
  EVEX_Vpermilps_zmm_k1z_zmm_zmmm512b32 = 2623,
  VEX_Vpermilpd_xmm_xmm_xmmm128 = 2624,
  VEX_Vpermilpd_ymm_ymm_ymmm256 = 2625,
  EVEX_Vpermilpd_xmm_k1z_xmm_xmmm128b64 = 2626,
  EVEX_Vpermilpd_ymm_k1z_ymm_ymmm256b64 = 2627,
  EVEX_Vpermilpd_zmm_k1z_zmm_zmmm512b64 = 2628,
  VEX_Vtestps_xmm_xmmm128 = 2629,
  VEX_Vtestps_ymm_ymmm256 = 2630,
  VEX_Vtestpd_xmm_xmmm128 = 2631,
  VEX_Vtestpd_ymm_ymmm256 = 2632,
  Pblendvb_xmm_xmmm128 = 2633,
  EVEX_Vpsrlvw_xmm_k1z_xmm_xmmm128 = 2634,
  EVEX_Vpsrlvw_ymm_k1z_ymm_ymmm256 = 2635,
  EVEX_Vpsrlvw_zmm_k1z_zmm_zmmm512 = 2636,
  EVEX_Vpmovuswb_xmmm64_k1z_xmm = 2637,
  EVEX_Vpmovuswb_xmmm128_k1z_ymm = 2638,
  EVEX_Vpmovuswb_ymmm256_k1z_zmm = 2639,
  EVEX_Vpsravw_xmm_k1z_xmm_xmmm128 = 2640,
  EVEX_Vpsravw_ymm_k1z_ymm_ymmm256 = 2641,
  EVEX_Vpsravw_zmm_k1z_zmm_zmmm512 = 2642,
  EVEX_Vpmovusdb_xmmm32_k1z_xmm = 2643,
  EVEX_Vpmovusdb_xmmm64_k1z_ymm = 2644,
  EVEX_Vpmovusdb_xmmm128_k1z_zmm = 2645,
  EVEX_Vpsllvw_xmm_k1z_xmm_xmmm128 = 2646,
  EVEX_Vpsllvw_ymm_k1z_ymm_ymmm256 = 2647,
  EVEX_Vpsllvw_zmm_k1z_zmm_zmmm512 = 2648,
  EVEX_Vpmovusqb_xmmm16_k1z_xmm = 2649,
  EVEX_Vpmovusqb_xmmm32_k1z_ymm = 2650,
  EVEX_Vpmovusqb_xmmm64_k1z_zmm = 2651,
  VEX_Vcvtph2ps_xmm_xmmm64 = 2652,
  VEX_Vcvtph2ps_ymm_xmmm128 = 2653,
  EVEX_Vcvtph2ps_xmm_k1z_xmmm64 = 2654,
  EVEX_Vcvtph2ps_ymm_k1z_xmmm128 = 2655,
  EVEX_Vcvtph2ps_zmm_k1z_ymmm256_sae = 2656,
  EVEX_Vpmovusdw_xmmm64_k1z_xmm = 2657,
  EVEX_Vpmovusdw_xmmm128_k1z_ymm = 2658,
  EVEX_Vpmovusdw_ymmm256_k1z_zmm = 2659,
  Blendvps_xmm_xmmm128 = 2660,
  EVEX_Vprorvd_xmm_k1z_xmm_xmmm128b32 = 2661,
  EVEX_Vprorvd_ymm_k1z_ymm_ymmm256b32 = 2662,
  EVEX_Vprorvd_zmm_k1z_zmm_zmmm512b32 = 2663,
  EVEX_Vprorvq_xmm_k1z_xmm_xmmm128b64 = 2664,
  EVEX_Vprorvq_ymm_k1z_ymm_ymmm256b64 = 2665,
  EVEX_Vprorvq_zmm_k1z_zmm_zmmm512b64 = 2666,
  EVEX_Vpmovusqw_xmmm32_k1z_xmm = 2667,
  EVEX_Vpmovusqw_xmmm64_k1z_ymm = 2668,
  EVEX_Vpmovusqw_xmmm128_k1z_zmm = 2669,
  Blendvpd_xmm_xmmm128 = 2670,
  EVEX_Vprolvd_xmm_k1z_xmm_xmmm128b32 = 2671,
  EVEX_Vprolvd_ymm_k1z_ymm_ymmm256b32 = 2672,
  EVEX_Vprolvd_zmm_k1z_zmm_zmmm512b32 = 2673,
  EVEX_Vprolvq_xmm_k1z_xmm_xmmm128b64 = 2674,
  EVEX_Vprolvq_ymm_k1z_ymm_ymmm256b64 = 2675,
  EVEX_Vprolvq_zmm_k1z_zmm_zmmm512b64 = 2676,
  EVEX_Vpmovusqd_xmmm64_k1z_xmm = 2677,
  EVEX_Vpmovusqd_xmmm128_k1z_ymm = 2678,
  EVEX_Vpmovusqd_ymmm256_k1z_zmm = 2679,
  VEX_Vpermps_ymm_ymm_ymmm256 = 2680,
  EVEX_Vpermps_ymm_k1z_ymm_ymmm256b32 = 2681,
  EVEX_Vpermps_zmm_k1z_zmm_zmmm512b32 = 2682,
  EVEX_Vpermpd_ymm_k1z_ymm_ymmm256b64 = 2683,
  EVEX_Vpermpd_zmm_k1z_zmm_zmmm512b64 = 2684,
  Ptest_xmm_xmmm128 = 2685,
  VEX_Vptest_xmm_xmmm128 = 2686,
  VEX_Vptest_ymm_ymmm256 = 2687,
  VEX_Vbroadcastss_xmm_m32 = 2688,
  VEX_Vbroadcastss_ymm_m32 = 2689,
  EVEX_Vbroadcastss_xmm_k1z_xmmm32 = 2690,
  EVEX_Vbroadcastss_ymm_k1z_xmmm32 = 2691,
  EVEX_Vbroadcastss_zmm_k1z_xmmm32 = 2692,
  VEX_Vbroadcastsd_ymm_m64 = 2693,
  EVEX_Vbroadcastf32x2_ymm_k1z_xmmm64 = 2694,
  EVEX_Vbroadcastf32x2_zmm_k1z_xmmm64 = 2695,
  EVEX_Vbroadcastsd_ymm_k1z_xmmm64 = 2696,
  EVEX_Vbroadcastsd_zmm_k1z_xmmm64 = 2697,
  VEX_Vbroadcastf128_ymm_m128 = 2698,
  EVEX_Vbroadcastf32x4_ymm_k1z_m128 = 2699,
  EVEX_Vbroadcastf32x4_zmm_k1z_m128 = 2700,
  EVEX_Vbroadcastf64x2_ymm_k1z_m128 = 2701,
  EVEX_Vbroadcastf64x2_zmm_k1z_m128 = 2702,
  EVEX_Vbroadcastf32x8_zmm_k1z_m256 = 2703,
  EVEX_Vbroadcastf64x4_zmm_k1z_m256 = 2704,
  Pabsb_mm_mmm64 = 2705,
  Pabsb_xmm_xmmm128 = 2706,
  VEX_Vpabsb_xmm_xmmm128 = 2707,
  VEX_Vpabsb_ymm_ymmm256 = 2708,
  EVEX_Vpabsb_xmm_k1z_xmmm128 = 2709,
  EVEX_Vpabsb_ymm_k1z_ymmm256 = 2710,
  EVEX_Vpabsb_zmm_k1z_zmmm512 = 2711,
  Pabsw_mm_mmm64 = 2712,
  Pabsw_xmm_xmmm128 = 2713,
  VEX_Vpabsw_xmm_xmmm128 = 2714,
  VEX_Vpabsw_ymm_ymmm256 = 2715,
  EVEX_Vpabsw_xmm_k1z_xmmm128 = 2716,
  EVEX_Vpabsw_ymm_k1z_ymmm256 = 2717,
  EVEX_Vpabsw_zmm_k1z_zmmm512 = 2718,
  Pabsd_mm_mmm64 = 2719,
  Pabsd_xmm_xmmm128 = 2720,
  VEX_Vpabsd_xmm_xmmm128 = 2721,
  VEX_Vpabsd_ymm_ymmm256 = 2722,
  EVEX_Vpabsd_xmm_k1z_xmmm128b32 = 2723,
  EVEX_Vpabsd_ymm_k1z_ymmm256b32 = 2724,
  EVEX_Vpabsd_zmm_k1z_zmmm512b32 = 2725,
  EVEX_Vpabsq_xmm_k1z_xmmm128b64 = 2726,
  EVEX_Vpabsq_ymm_k1z_ymmm256b64 = 2727,
  EVEX_Vpabsq_zmm_k1z_zmmm512b64 = 2728,
  Pmovsxbw_xmm_xmmm64 = 2729,
  VEX_Vpmovsxbw_xmm_xmmm64 = 2730,
  VEX_Vpmovsxbw_ymm_xmmm128 = 2731,
  EVEX_Vpmovsxbw_xmm_k1z_xmmm64 = 2732,
  EVEX_Vpmovsxbw_ymm_k1z_xmmm128 = 2733,
  EVEX_Vpmovsxbw_zmm_k1z_ymmm256 = 2734,
  EVEX_Vpmovswb_xmmm64_k1z_xmm = 2735,
  EVEX_Vpmovswb_xmmm128_k1z_ymm = 2736,
  EVEX_Vpmovswb_ymmm256_k1z_zmm = 2737,
  Pmovsxbd_xmm_xmmm32 = 2738,
  VEX_Vpmovsxbd_xmm_xmmm32 = 2739,
  VEX_Vpmovsxbd_ymm_xmmm64 = 2740,
  EVEX_Vpmovsxbd_xmm_k1z_xmmm32 = 2741,
  EVEX_Vpmovsxbd_ymm_k1z_xmmm64 = 2742,
  EVEX_Vpmovsxbd_zmm_k1z_xmmm128 = 2743,
  EVEX_Vpmovsdb_xmmm32_k1z_xmm = 2744,
  EVEX_Vpmovsdb_xmmm64_k1z_ymm = 2745,
  EVEX_Vpmovsdb_xmmm128_k1z_zmm = 2746,
  Pmovsxbq_xmm_xmmm16 = 2747,
  VEX_Vpmovsxbq_xmm_xmmm16 = 2748,
  VEX_Vpmovsxbq_ymm_xmmm32 = 2749,
  EVEX_Vpmovsxbq_xmm_k1z_xmmm16 = 2750,
  EVEX_Vpmovsxbq_ymm_k1z_xmmm32 = 2751,
  EVEX_Vpmovsxbq_zmm_k1z_xmmm64 = 2752,
  EVEX_Vpmovsqb_xmmm16_k1z_xmm = 2753,
  EVEX_Vpmovsqb_xmmm32_k1z_ymm = 2754,
  EVEX_Vpmovsqb_xmmm64_k1z_zmm = 2755,
  Pmovsxwd_xmm_xmmm64 = 2756,
  VEX_Vpmovsxwd_xmm_xmmm64 = 2757,
  VEX_Vpmovsxwd_ymm_xmmm128 = 2758,
  EVEX_Vpmovsxwd_xmm_k1z_xmmm64 = 2759,
  EVEX_Vpmovsxwd_ymm_k1z_xmmm128 = 2760,
  EVEX_Vpmovsxwd_zmm_k1z_ymmm256 = 2761,
  EVEX_Vpmovsdw_xmmm64_k1z_xmm = 2762,
  EVEX_Vpmovsdw_xmmm128_k1z_ymm = 2763,
  EVEX_Vpmovsdw_ymmm256_k1z_zmm = 2764,
  Pmovsxwq_xmm_xmmm32 = 2765,
  VEX_Vpmovsxwq_xmm_xmmm32 = 2766,
  VEX_Vpmovsxwq_ymm_xmmm64 = 2767,
  EVEX_Vpmovsxwq_xmm_k1z_xmmm32 = 2768,
  EVEX_Vpmovsxwq_ymm_k1z_xmmm64 = 2769,
  EVEX_Vpmovsxwq_zmm_k1z_xmmm128 = 2770,
  EVEX_Vpmovsqw_xmmm32_k1z_xmm = 2771,
  EVEX_Vpmovsqw_xmmm64_k1z_ymm = 2772,
  EVEX_Vpmovsqw_xmmm128_k1z_zmm = 2773,
  Pmovsxdq_xmm_xmmm64 = 2774,
  VEX_Vpmovsxdq_xmm_xmmm64 = 2775,
  VEX_Vpmovsxdq_ymm_xmmm128 = 2776,
  EVEX_Vpmovsxdq_xmm_k1z_xmmm64 = 2777,
  EVEX_Vpmovsxdq_ymm_k1z_xmmm128 = 2778,
  EVEX_Vpmovsxdq_zmm_k1z_ymmm256 = 2779,
  EVEX_Vpmovsqd_xmmm64_k1z_xmm = 2780,
  EVEX_Vpmovsqd_xmmm128_k1z_ymm = 2781,
  EVEX_Vpmovsqd_ymmm256_k1z_zmm = 2782,
  EVEX_Vptestmb_kr_k1_xmm_xmmm128 = 2783,
  EVEX_Vptestmb_kr_k1_ymm_ymmm256 = 2784,
  EVEX_Vptestmb_kr_k1_zmm_zmmm512 = 2785,
  EVEX_Vptestmw_kr_k1_xmm_xmmm128 = 2786,
  EVEX_Vptestmw_kr_k1_ymm_ymmm256 = 2787,
  EVEX_Vptestmw_kr_k1_zmm_zmmm512 = 2788,
  EVEX_Vptestnmb_kr_k1_xmm_xmmm128 = 2789,
  EVEX_Vptestnmb_kr_k1_ymm_ymmm256 = 2790,
  EVEX_Vptestnmb_kr_k1_zmm_zmmm512 = 2791,
  EVEX_Vptestnmw_kr_k1_xmm_xmmm128 = 2792,
  EVEX_Vptestnmw_kr_k1_ymm_ymmm256 = 2793,
  EVEX_Vptestnmw_kr_k1_zmm_zmmm512 = 2794,
  EVEX_Vptestmd_kr_k1_xmm_xmmm128b32 = 2795,
  EVEX_Vptestmd_kr_k1_ymm_ymmm256b32 = 2796,
  EVEX_Vptestmd_kr_k1_zmm_zmmm512b32 = 2797,
  EVEX_Vptestmq_kr_k1_xmm_xmmm128b64 = 2798,
  EVEX_Vptestmq_kr_k1_ymm_ymmm256b64 = 2799,
  EVEX_Vptestmq_kr_k1_zmm_zmmm512b64 = 2800,
  EVEX_Vptestnmd_kr_k1_xmm_xmmm128b32 = 2801,
  EVEX_Vptestnmd_kr_k1_ymm_ymmm256b32 = 2802,
  EVEX_Vptestnmd_kr_k1_zmm_zmmm512b32 = 2803,
  EVEX_Vptestnmq_kr_k1_xmm_xmmm128b64 = 2804,
  EVEX_Vptestnmq_kr_k1_ymm_ymmm256b64 = 2805,
  EVEX_Vptestnmq_kr_k1_zmm_zmmm512b64 = 2806,
  Pmuldq_xmm_xmmm128 = 2807,
  VEX_Vpmuldq_xmm_xmm_xmmm128 = 2808,
  VEX_Vpmuldq_ymm_ymm_ymmm256 = 2809,
  EVEX_Vpmuldq_xmm_k1z_xmm_xmmm128b64 = 2810,
  EVEX_Vpmuldq_ymm_k1z_ymm_ymmm256b64 = 2811,
  EVEX_Vpmuldq_zmm_k1z_zmm_zmmm512b64 = 2812,
  EVEX_Vpmovm2b_xmm_kr = 2813,
  EVEX_Vpmovm2b_ymm_kr = 2814,
  EVEX_Vpmovm2b_zmm_kr = 2815,
  EVEX_Vpmovm2w_xmm_kr = 2816,
  EVEX_Vpmovm2w_ymm_kr = 2817,
  EVEX_Vpmovm2w_zmm_kr = 2818,
  Pcmpeqq_xmm_xmmm128 = 2819,
  VEX_Vpcmpeqq_xmm_xmm_xmmm128 = 2820,
  VEX_Vpcmpeqq_ymm_ymm_ymmm256 = 2821,
  EVEX_Vpcmpeqq_kr_k1_xmm_xmmm128b64 = 2822,
  EVEX_Vpcmpeqq_kr_k1_ymm_ymmm256b64 = 2823,
  EVEX_Vpcmpeqq_kr_k1_zmm_zmmm512b64 = 2824,
  EVEX_Vpmovb2m_kr_xmm = 2825,
  EVEX_Vpmovb2m_kr_ymm = 2826,
  EVEX_Vpmovb2m_kr_zmm = 2827,
  EVEX_Vpmovw2m_kr_xmm = 2828,
  EVEX_Vpmovw2m_kr_ymm = 2829,
  EVEX_Vpmovw2m_kr_zmm = 2830,
  Movntdqa_xmm_m128 = 2831,
  VEX_Vmovntdqa_xmm_m128 = 2832,
  VEX_Vmovntdqa_ymm_m256 = 2833,
  EVEX_Vmovntdqa_xmm_m128 = 2834,
  EVEX_Vmovntdqa_ymm_m256 = 2835,
  EVEX_Vmovntdqa_zmm_m512 = 2836,
  EVEX_Vpbroadcastmb2q_xmm_kr = 2837,
  EVEX_Vpbroadcastmb2q_ymm_kr = 2838,
  EVEX_Vpbroadcastmb2q_zmm_kr = 2839,
  Packusdw_xmm_xmmm128 = 2840,
  VEX_Vpackusdw_xmm_xmm_xmmm128 = 2841,
  VEX_Vpackusdw_ymm_ymm_ymmm256 = 2842,
  EVEX_Vpackusdw_xmm_k1z_xmm_xmmm128b32 = 2843,
  EVEX_Vpackusdw_ymm_k1z_ymm_ymmm256b32 = 2844,
  EVEX_Vpackusdw_zmm_k1z_zmm_zmmm512b32 = 2845,
  VEX_Vmaskmovps_xmm_xmm_m128 = 2846,
  VEX_Vmaskmovps_ymm_ymm_m256 = 2847,
  EVEX_Vscalefps_xmm_k1z_xmm_xmmm128b32 = 2848,
  EVEX_Vscalefps_ymm_k1z_ymm_ymmm256b32 = 2849,
  EVEX_Vscalefps_zmm_k1z_zmm_zmmm512b32_er = 2850,
  EVEX_Vscalefpd_xmm_k1z_xmm_xmmm128b64 = 2851,
  EVEX_Vscalefpd_ymm_k1z_ymm_ymmm256b64 = 2852,
  EVEX_Vscalefpd_zmm_k1z_zmm_zmmm512b64_er = 2853,
  VEX_Vmaskmovpd_xmm_xmm_m128 = 2854,
  VEX_Vmaskmovpd_ymm_ymm_m256 = 2855,
  EVEX_Vscalefss_xmm_k1z_xmm_xmmm32_er = 2856,
  EVEX_Vscalefsd_xmm_k1z_xmm_xmmm64_er = 2857,
  VEX_Vmaskmovps_m128_xmm_xmm = 2858,
  VEX_Vmaskmovps_m256_ymm_ymm = 2859,
  VEX_Vmaskmovpd_m128_xmm_xmm = 2860,
  VEX_Vmaskmovpd_m256_ymm_ymm = 2861,
  Pmovzxbw_xmm_xmmm64 = 2862,
  VEX_Vpmovzxbw_xmm_xmmm64 = 2863,
  VEX_Vpmovzxbw_ymm_xmmm128 = 2864,
  EVEX_Vpmovzxbw_xmm_k1z_xmmm64 = 2865,
  EVEX_Vpmovzxbw_ymm_k1z_xmmm128 = 2866,
  EVEX_Vpmovzxbw_zmm_k1z_ymmm256 = 2867,
  EVEX_Vpmovwb_xmmm64_k1z_xmm = 2868,
  EVEX_Vpmovwb_xmmm128_k1z_ymm = 2869,
  EVEX_Vpmovwb_ymmm256_k1z_zmm = 2870,
  Pmovzxbd_xmm_xmmm32 = 2871,
  VEX_Vpmovzxbd_xmm_xmmm32 = 2872,
  VEX_Vpmovzxbd_ymm_xmmm64 = 2873,
  EVEX_Vpmovzxbd_xmm_k1z_xmmm32 = 2874,
  EVEX_Vpmovzxbd_ymm_k1z_xmmm64 = 2875,
  EVEX_Vpmovzxbd_zmm_k1z_xmmm128 = 2876,
  EVEX_Vpmovdb_xmmm32_k1z_xmm = 2877,
  EVEX_Vpmovdb_xmmm64_k1z_ymm = 2878,
  EVEX_Vpmovdb_xmmm128_k1z_zmm = 2879,
  Pmovzxbq_xmm_xmmm16 = 2880,
  VEX_Vpmovzxbq_xmm_xmmm16 = 2881,
  VEX_Vpmovzxbq_ymm_xmmm32 = 2882,
  EVEX_Vpmovzxbq_xmm_k1z_xmmm16 = 2883,
  EVEX_Vpmovzxbq_ymm_k1z_xmmm32 = 2884,
  EVEX_Vpmovzxbq_zmm_k1z_xmmm64 = 2885,
  EVEX_Vpmovqb_xmmm16_k1z_xmm = 2886,
  EVEX_Vpmovqb_xmmm32_k1z_ymm = 2887,
  EVEX_Vpmovqb_xmmm64_k1z_zmm = 2888,
  Pmovzxwd_xmm_xmmm64 = 2889,
  VEX_Vpmovzxwd_xmm_xmmm64 = 2890,
  VEX_Vpmovzxwd_ymm_xmmm128 = 2891,
  EVEX_Vpmovzxwd_xmm_k1z_xmmm64 = 2892,
  EVEX_Vpmovzxwd_ymm_k1z_xmmm128 = 2893,
  EVEX_Vpmovzxwd_zmm_k1z_ymmm256 = 2894,
  EVEX_Vpmovdw_xmmm64_k1z_xmm = 2895,
  EVEX_Vpmovdw_xmmm128_k1z_ymm = 2896,
  EVEX_Vpmovdw_ymmm256_k1z_zmm = 2897,
  Pmovzxwq_xmm_xmmm32 = 2898,
  VEX_Vpmovzxwq_xmm_xmmm32 = 2899,
  VEX_Vpmovzxwq_ymm_xmmm64 = 2900,
  EVEX_Vpmovzxwq_xmm_k1z_xmmm32 = 2901,
  EVEX_Vpmovzxwq_ymm_k1z_xmmm64 = 2902,
  EVEX_Vpmovzxwq_zmm_k1z_xmmm128 = 2903,
  EVEX_Vpmovqw_xmmm32_k1z_xmm = 2904,
  EVEX_Vpmovqw_xmmm64_k1z_ymm = 2905,
  EVEX_Vpmovqw_xmmm128_k1z_zmm = 2906,
  Pmovzxdq_xmm_xmmm64 = 2907,
  VEX_Vpmovzxdq_xmm_xmmm64 = 2908,
  VEX_Vpmovzxdq_ymm_xmmm128 = 2909,
  EVEX_Vpmovzxdq_xmm_k1z_xmmm64 = 2910,
  EVEX_Vpmovzxdq_ymm_k1z_xmmm128 = 2911,
  EVEX_Vpmovzxdq_zmm_k1z_ymmm256 = 2912,
  EVEX_Vpmovqd_xmmm64_k1z_xmm = 2913,
  EVEX_Vpmovqd_xmmm128_k1z_ymm = 2914,
  EVEX_Vpmovqd_ymmm256_k1z_zmm = 2915,
  VEX_Vpermd_ymm_ymm_ymmm256 = 2916,
  EVEX_Vpermd_ymm_k1z_ymm_ymmm256b32 = 2917,
  EVEX_Vpermd_zmm_k1z_zmm_zmmm512b32 = 2918,
  EVEX_Vpermq_ymm_k1z_ymm_ymmm256b64 = 2919,
  EVEX_Vpermq_zmm_k1z_zmm_zmmm512b64 = 2920,
  Pcmpgtq_xmm_xmmm128 = 2921,
  VEX_Vpcmpgtq_xmm_xmm_xmmm128 = 2922,
  VEX_Vpcmpgtq_ymm_ymm_ymmm256 = 2923,
  EVEX_Vpcmpgtq_kr_k1_xmm_xmmm128b64 = 2924,
  EVEX_Vpcmpgtq_kr_k1_ymm_ymmm256b64 = 2925,
  EVEX_Vpcmpgtq_kr_k1_zmm_zmmm512b64 = 2926,
  Pminsb_xmm_xmmm128 = 2927,
  VEX_Vpminsb_xmm_xmm_xmmm128 = 2928,
  VEX_Vpminsb_ymm_ymm_ymmm256 = 2929,
  EVEX_Vpminsb_xmm_k1z_xmm_xmmm128 = 2930,
  EVEX_Vpminsb_ymm_k1z_ymm_ymmm256 = 2931,
  EVEX_Vpminsb_zmm_k1z_zmm_zmmm512 = 2932,
  EVEX_Vpmovm2d_xmm_kr = 2933,
  EVEX_Vpmovm2d_ymm_kr = 2934,
  EVEX_Vpmovm2d_zmm_kr = 2935,
  EVEX_Vpmovm2q_xmm_kr = 2936,
  EVEX_Vpmovm2q_ymm_kr = 2937,
  EVEX_Vpmovm2q_zmm_kr = 2938,
  Pminsd_xmm_xmmm128 = 2939,
  VEX_Vpminsd_xmm_xmm_xmmm128 = 2940,
  VEX_Vpminsd_ymm_ymm_ymmm256 = 2941,
  EVEX_Vpminsd_xmm_k1z_xmm_xmmm128b32 = 2942,
  EVEX_Vpminsd_ymm_k1z_ymm_ymmm256b32 = 2943,
  EVEX_Vpminsd_zmm_k1z_zmm_zmmm512b32 = 2944,
  EVEX_Vpminsq_xmm_k1z_xmm_xmmm128b64 = 2945,
  EVEX_Vpminsq_ymm_k1z_ymm_ymmm256b64 = 2946,
  EVEX_Vpminsq_zmm_k1z_zmm_zmmm512b64 = 2947,
  EVEX_Vpmovd2m_kr_xmm = 2948,
  EVEX_Vpmovd2m_kr_ymm = 2949,
  EVEX_Vpmovd2m_kr_zmm = 2950,
  EVEX_Vpmovq2m_kr_xmm = 2951,
  EVEX_Vpmovq2m_kr_ymm = 2952,
  EVEX_Vpmovq2m_kr_zmm = 2953,
  Pminuw_xmm_xmmm128 = 2954,
  VEX_Vpminuw_xmm_xmm_xmmm128 = 2955,
  VEX_Vpminuw_ymm_ymm_ymmm256 = 2956,
  EVEX_Vpminuw_xmm_k1z_xmm_xmmm128 = 2957,
  EVEX_Vpminuw_ymm_k1z_ymm_ymmm256 = 2958,
  EVEX_Vpminuw_zmm_k1z_zmm_zmmm512 = 2959,
  EVEX_Vpbroadcastmw2d_xmm_kr = 2960,
  EVEX_Vpbroadcastmw2d_ymm_kr = 2961,
  EVEX_Vpbroadcastmw2d_zmm_kr = 2962,
  Pminud_xmm_xmmm128 = 2963,
  VEX_Vpminud_xmm_xmm_xmmm128 = 2964,
  VEX_Vpminud_ymm_ymm_ymmm256 = 2965,
  EVEX_Vpminud_xmm_k1z_xmm_xmmm128b32 = 2966,
  EVEX_Vpminud_ymm_k1z_ymm_ymmm256b32 = 2967,
  EVEX_Vpminud_zmm_k1z_zmm_zmmm512b32 = 2968,
  EVEX_Vpminuq_xmm_k1z_xmm_xmmm128b64 = 2969,
  EVEX_Vpminuq_ymm_k1z_ymm_ymmm256b64 = 2970,
  EVEX_Vpminuq_zmm_k1z_zmm_zmmm512b64 = 2971,
  Pmaxsb_xmm_xmmm128 = 2972,
  VEX_Vpmaxsb_xmm_xmm_xmmm128 = 2973,
  VEX_Vpmaxsb_ymm_ymm_ymmm256 = 2974,
  EVEX_Vpmaxsb_xmm_k1z_xmm_xmmm128 = 2975,
  EVEX_Vpmaxsb_ymm_k1z_ymm_ymmm256 = 2976,
  EVEX_Vpmaxsb_zmm_k1z_zmm_zmmm512 = 2977,
  Pmaxsd_xmm_xmmm128 = 2978,
  VEX_Vpmaxsd_xmm_xmm_xmmm128 = 2979,
  VEX_Vpmaxsd_ymm_ymm_ymmm256 = 2980,
  EVEX_Vpmaxsd_xmm_k1z_xmm_xmmm128b32 = 2981,
  EVEX_Vpmaxsd_ymm_k1z_ymm_ymmm256b32 = 2982,
  EVEX_Vpmaxsd_zmm_k1z_zmm_zmmm512b32 = 2983,
  EVEX_Vpmaxsq_xmm_k1z_xmm_xmmm128b64 = 2984,
  EVEX_Vpmaxsq_ymm_k1z_ymm_ymmm256b64 = 2985,
  EVEX_Vpmaxsq_zmm_k1z_zmm_zmmm512b64 = 2986,
  Pmaxuw_xmm_xmmm128 = 2987,
  VEX_Vpmaxuw_xmm_xmm_xmmm128 = 2988,
  VEX_Vpmaxuw_ymm_ymm_ymmm256 = 2989,
  EVEX_Vpmaxuw_xmm_k1z_xmm_xmmm128 = 2990,
  EVEX_Vpmaxuw_ymm_k1z_ymm_ymmm256 = 2991,
  EVEX_Vpmaxuw_zmm_k1z_zmm_zmmm512 = 2992,
  Pmaxud_xmm_xmmm128 = 2993,
  VEX_Vpmaxud_xmm_xmm_xmmm128 = 2994,
  VEX_Vpmaxud_ymm_ymm_ymmm256 = 2995,
  EVEX_Vpmaxud_xmm_k1z_xmm_xmmm128b32 = 2996,
  EVEX_Vpmaxud_ymm_k1z_ymm_ymmm256b32 = 2997,
  EVEX_Vpmaxud_zmm_k1z_zmm_zmmm512b32 = 2998,
  EVEX_Vpmaxuq_xmm_k1z_xmm_xmmm128b64 = 2999,
  EVEX_Vpmaxuq_ymm_k1z_ymm_ymmm256b64 = 3000,
  EVEX_Vpmaxuq_zmm_k1z_zmm_zmmm512b64 = 3001,
  Pmulld_xmm_xmmm128 = 3002,
  VEX_Vpmulld_xmm_xmm_xmmm128 = 3003,
  VEX_Vpmulld_ymm_ymm_ymmm256 = 3004,
  EVEX_Vpmulld_xmm_k1z_xmm_xmmm128b32 = 3005,
  EVEX_Vpmulld_ymm_k1z_ymm_ymmm256b32 = 3006,
  EVEX_Vpmulld_zmm_k1z_zmm_zmmm512b32 = 3007,
  EVEX_Vpmullq_xmm_k1z_xmm_xmmm128b64 = 3008,
  EVEX_Vpmullq_ymm_k1z_ymm_ymmm256b64 = 3009,
  EVEX_Vpmullq_zmm_k1z_zmm_zmmm512b64 = 3010,
  Phminposuw_xmm_xmmm128 = 3011,
  VEX_Vphminposuw_xmm_xmmm128 = 3012,
  EVEX_Vgetexpps_xmm_k1z_xmmm128b32 = 3013,
  EVEX_Vgetexpps_ymm_k1z_ymmm256b32 = 3014,
  EVEX_Vgetexpps_zmm_k1z_zmmm512b32_sae = 3015,
  EVEX_Vgetexppd_xmm_k1z_xmmm128b64 = 3016,
  EVEX_Vgetexppd_ymm_k1z_ymmm256b64 = 3017,
  EVEX_Vgetexppd_zmm_k1z_zmmm512b64_sae = 3018,
  EVEX_Vgetexpss_xmm_k1z_xmm_xmmm32_sae = 3019,
  EVEX_Vgetexpsd_xmm_k1z_xmm_xmmm64_sae = 3020,
  EVEX_Vplzcntd_xmm_k1z_xmmm128b32 = 3021,
  EVEX_Vplzcntd_ymm_k1z_ymmm256b32 = 3022,
  EVEX_Vplzcntd_zmm_k1z_zmmm512b32 = 3023,
  EVEX_Vplzcntq_xmm_k1z_xmmm128b64 = 3024,
  EVEX_Vplzcntq_ymm_k1z_ymmm256b64 = 3025,
  EVEX_Vplzcntq_zmm_k1z_zmmm512b64 = 3026,
  VEX_Vpsrlvd_xmm_xmm_xmmm128 = 3027,
  VEX_Vpsrlvd_ymm_ymm_ymmm256 = 3028,
  VEX_Vpsrlvq_xmm_xmm_xmmm128 = 3029,
  VEX_Vpsrlvq_ymm_ymm_ymmm256 = 3030,
  EVEX_Vpsrlvd_xmm_k1z_xmm_xmmm128b32 = 3031,
  EVEX_Vpsrlvd_ymm_k1z_ymm_ymmm256b32 = 3032,
  EVEX_Vpsrlvd_zmm_k1z_zmm_zmmm512b32 = 3033,
  EVEX_Vpsrlvq_xmm_k1z_xmm_xmmm128b64 = 3034,
  EVEX_Vpsrlvq_ymm_k1z_ymm_ymmm256b64 = 3035,
  EVEX_Vpsrlvq_zmm_k1z_zmm_zmmm512b64 = 3036,
  VEX_Vpsravd_xmm_xmm_xmmm128 = 3037,
  VEX_Vpsravd_ymm_ymm_ymmm256 = 3038,
  EVEX_Vpsravd_xmm_k1z_xmm_xmmm128b32 = 3039,
  EVEX_Vpsravd_ymm_k1z_ymm_ymmm256b32 = 3040,
  EVEX_Vpsravd_zmm_k1z_zmm_zmmm512b32 = 3041,
  EVEX_Vpsravq_xmm_k1z_xmm_xmmm128b64 = 3042,
  EVEX_Vpsravq_ymm_k1z_ymm_ymmm256b64 = 3043,
  EVEX_Vpsravq_zmm_k1z_zmm_zmmm512b64 = 3044,
  VEX_Vpsllvd_xmm_xmm_xmmm128 = 3045,
  VEX_Vpsllvd_ymm_ymm_ymmm256 = 3046,
  VEX_Vpsllvq_xmm_xmm_xmmm128 = 3047,
  VEX_Vpsllvq_ymm_ymm_ymmm256 = 3048,
  EVEX_Vpsllvd_xmm_k1z_xmm_xmmm128b32 = 3049,
  EVEX_Vpsllvd_ymm_k1z_ymm_ymmm256b32 = 3050,
  EVEX_Vpsllvd_zmm_k1z_zmm_zmmm512b32 = 3051,
  EVEX_Vpsllvq_xmm_k1z_xmm_xmmm128b64 = 3052,
  EVEX_Vpsllvq_ymm_k1z_ymm_ymmm256b64 = 3053,
  EVEX_Vpsllvq_zmm_k1z_zmm_zmmm512b64 = 3054,
  EVEX_Vrcp14ps_xmm_k1z_xmmm128b32 = 3055,
  EVEX_Vrcp14ps_ymm_k1z_ymmm256b32 = 3056,
  EVEX_Vrcp14ps_zmm_k1z_zmmm512b32 = 3057,
  EVEX_Vrcp14pd_xmm_k1z_xmmm128b64 = 3058,
  EVEX_Vrcp14pd_ymm_k1z_ymmm256b64 = 3059,
  EVEX_Vrcp14pd_zmm_k1z_zmmm512b64 = 3060,
  EVEX_Vrcp14ss_xmm_k1z_xmm_xmmm32 = 3061,
  EVEX_Vrcp14sd_xmm_k1z_xmm_xmmm64 = 3062,
  EVEX_Vrsqrt14ps_xmm_k1z_xmmm128b32 = 3063,
  EVEX_Vrsqrt14ps_ymm_k1z_ymmm256b32 = 3064,
  EVEX_Vrsqrt14ps_zmm_k1z_zmmm512b32 = 3065,
  EVEX_Vrsqrt14pd_xmm_k1z_xmmm128b64 = 3066,
  EVEX_Vrsqrt14pd_ymm_k1z_ymmm256b64 = 3067,
  EVEX_Vrsqrt14pd_zmm_k1z_zmmm512b64 = 3068,
  EVEX_Vrsqrt14ss_xmm_k1z_xmm_xmmm32 = 3069,
  EVEX_Vrsqrt14sd_xmm_k1z_xmm_xmmm64 = 3070,
  EVEX_Vpdpbusd_xmm_k1z_xmm_xmmm128b32 = 3071,
  EVEX_Vpdpbusd_ymm_k1z_ymm_ymmm256b32 = 3072,
  EVEX_Vpdpbusd_zmm_k1z_zmm_zmmm512b32 = 3073,
  EVEX_Vpdpbusds_xmm_k1z_xmm_xmmm128b32 = 3074,
  EVEX_Vpdpbusds_ymm_k1z_ymm_ymmm256b32 = 3075,
  EVEX_Vpdpbusds_zmm_k1z_zmm_zmmm512b32 = 3076,
  EVEX_Vpdpwssd_xmm_k1z_xmm_xmmm128b32 = 3077,
  EVEX_Vpdpwssd_ymm_k1z_ymm_ymmm256b32 = 3078,
  EVEX_Vpdpwssd_zmm_k1z_zmm_zmmm512b32 = 3079,
  EVEX_Vdpbf16ps_xmm_k1z_xmm_xmmm128b32 = 3080,
  EVEX_Vdpbf16ps_ymm_k1z_ymm_ymmm256b32 = 3081,
  EVEX_Vdpbf16ps_zmm_k1z_zmm_zmmm512b32 = 3082,
  EVEX_Vp4dpwssd_zmm_k1z_zmmp3_m128 = 3083,
  EVEX_Vpdpwssds_xmm_k1z_xmm_xmmm128b32 = 3084,
  EVEX_Vpdpwssds_ymm_k1z_ymm_ymmm256b32 = 3085,
  EVEX_Vpdpwssds_zmm_k1z_zmm_zmmm512b32 = 3086,
  EVEX_Vp4dpwssds_zmm_k1z_zmmp3_m128 = 3087,
  EVEX_Vpopcntb_xmm_k1z_xmmm128 = 3088,
  EVEX_Vpopcntb_ymm_k1z_ymmm256 = 3089,
  EVEX_Vpopcntb_zmm_k1z_zmmm512 = 3090,
  EVEX_Vpopcntw_xmm_k1z_xmmm128 = 3091,
  EVEX_Vpopcntw_ymm_k1z_ymmm256 = 3092,
  EVEX_Vpopcntw_zmm_k1z_zmmm512 = 3093,
  EVEX_Vpopcntd_xmm_k1z_xmmm128b32 = 3094,
  EVEX_Vpopcntd_ymm_k1z_ymmm256b32 = 3095,
  EVEX_Vpopcntd_zmm_k1z_zmmm512b32 = 3096,
  EVEX_Vpopcntq_xmm_k1z_xmmm128b64 = 3097,
  EVEX_Vpopcntq_ymm_k1z_ymmm256b64 = 3098,
  EVEX_Vpopcntq_zmm_k1z_zmmm512b64 = 3099,
  VEX_Vpbroadcastd_xmm_xmmm32 = 3100,
  VEX_Vpbroadcastd_ymm_xmmm32 = 3101,
  EVEX_Vpbroadcastd_xmm_k1z_xmmm32 = 3102,
  EVEX_Vpbroadcastd_ymm_k1z_xmmm32 = 3103,
  EVEX_Vpbroadcastd_zmm_k1z_xmmm32 = 3104,
  VEX_Vpbroadcastq_xmm_xmmm64 = 3105,
  VEX_Vpbroadcastq_ymm_xmmm64 = 3106,
  EVEX_Vbroadcasti32x2_xmm_k1z_xmmm64 = 3107,
  EVEX_Vbroadcasti32x2_ymm_k1z_xmmm64 = 3108,
  EVEX_Vbroadcasti32x2_zmm_k1z_xmmm64 = 3109,
  EVEX_Vpbroadcastq_xmm_k1z_xmmm64 = 3110,
  EVEX_Vpbroadcastq_ymm_k1z_xmmm64 = 3111,
  EVEX_Vpbroadcastq_zmm_k1z_xmmm64 = 3112,
  VEX_Vbroadcasti128_ymm_m128 = 3113,
  EVEX_Vbroadcasti32x4_ymm_k1z_m128 = 3114,
  EVEX_Vbroadcasti32x4_zmm_k1z_m128 = 3115,
  EVEX_Vbroadcasti64x2_ymm_k1z_m128 = 3116,
  EVEX_Vbroadcasti64x2_zmm_k1z_m128 = 3117,
  EVEX_Vbroadcasti32x8_zmm_k1z_m256 = 3118,
  EVEX_Vbroadcasti64x4_zmm_k1z_m256 = 3119,
  EVEX_Vpexpandb_xmm_k1z_xmmm128 = 3120,
  EVEX_Vpexpandb_ymm_k1z_ymmm256 = 3121,
  EVEX_Vpexpandb_zmm_k1z_zmmm512 = 3122,
  EVEX_Vpexpandw_xmm_k1z_xmmm128 = 3123,
  EVEX_Vpexpandw_ymm_k1z_ymmm256 = 3124,
  EVEX_Vpexpandw_zmm_k1z_zmmm512 = 3125,
  EVEX_Vpcompressb_xmmm128_k1z_xmm = 3126,
  EVEX_Vpcompressb_ymmm256_k1z_ymm = 3127,
  EVEX_Vpcompressb_zmmm512_k1z_zmm = 3128,
  EVEX_Vpcompressw_xmmm128_k1z_xmm = 3129,
  EVEX_Vpcompressw_ymmm256_k1z_ymm = 3130,
  EVEX_Vpcompressw_zmmm512_k1z_zmm = 3131,
  EVEX_Vpblendmd_xmm_k1z_xmm_xmmm128b32 = 3132,
  EVEX_Vpblendmd_ymm_k1z_ymm_ymmm256b32 = 3133,
  EVEX_Vpblendmd_zmm_k1z_zmm_zmmm512b32 = 3134,
  EVEX_Vpblendmq_xmm_k1z_xmm_xmmm128b64 = 3135,
  EVEX_Vpblendmq_ymm_k1z_ymm_ymmm256b64 = 3136,
  EVEX_Vpblendmq_zmm_k1z_zmm_zmmm512b64 = 3137,
  EVEX_Vblendmps_xmm_k1z_xmm_xmmm128b32 = 3138,
  EVEX_Vblendmps_ymm_k1z_ymm_ymmm256b32 = 3139,
  EVEX_Vblendmps_zmm_k1z_zmm_zmmm512b32 = 3140,
  EVEX_Vblendmpd_xmm_k1z_xmm_xmmm128b64 = 3141,
  EVEX_Vblendmpd_ymm_k1z_ymm_ymmm256b64 = 3142,
  EVEX_Vblendmpd_zmm_k1z_zmm_zmmm512b64 = 3143,
  EVEX_Vpblendmb_xmm_k1z_xmm_xmmm128 = 3144,
  EVEX_Vpblendmb_ymm_k1z_ymm_ymmm256 = 3145,
  EVEX_Vpblendmb_zmm_k1z_zmm_zmmm512 = 3146,
  EVEX_Vpblendmw_xmm_k1z_xmm_xmmm128 = 3147,
  EVEX_Vpblendmw_ymm_k1z_ymm_ymmm256 = 3148,
  EVEX_Vpblendmw_zmm_k1z_zmm_zmmm512 = 3149,
  EVEX_Vp2intersectd_kp1_xmm_xmmm128b32 = 3150,
  EVEX_Vp2intersectd_kp1_ymm_ymmm256b32 = 3151,
  EVEX_Vp2intersectd_kp1_zmm_zmmm512b32 = 3152,
  EVEX_Vp2intersectq_kp1_xmm_xmmm128b64 = 3153,
  EVEX_Vp2intersectq_kp1_ymm_ymmm256b64 = 3154,
  EVEX_Vp2intersectq_kp1_zmm_zmmm512b64 = 3155,
  EVEX_Vpshldvw_xmm_k1z_xmm_xmmm128 = 3156,
  EVEX_Vpshldvw_ymm_k1z_ymm_ymmm256 = 3157,
  EVEX_Vpshldvw_zmm_k1z_zmm_zmmm512 = 3158,
  EVEX_Vpshldvd_xmm_k1z_xmm_xmmm128b32 = 3159,
  EVEX_Vpshldvd_ymm_k1z_ymm_ymmm256b32 = 3160,
  EVEX_Vpshldvd_zmm_k1z_zmm_zmmm512b32 = 3161,
  EVEX_Vpshldvq_xmm_k1z_xmm_xmmm128b64 = 3162,
  EVEX_Vpshldvq_ymm_k1z_ymm_ymmm256b64 = 3163,
  EVEX_Vpshldvq_zmm_k1z_zmm_zmmm512b64 = 3164,
  EVEX_Vpshrdvw_xmm_k1z_xmm_xmmm128 = 3165,
  EVEX_Vpshrdvw_ymm_k1z_ymm_ymmm256 = 3166,
  EVEX_Vpshrdvw_zmm_k1z_zmm_zmmm512 = 3167,
  EVEX_Vcvtneps2bf16_xmm_k1z_xmmm128b32 = 3168,
  EVEX_Vcvtneps2bf16_xmm_k1z_ymmm256b32 = 3169,
  EVEX_Vcvtneps2bf16_ymm_k1z_zmmm512b32 = 3170,
  EVEX_Vcvtne2ps2bf16_xmm_k1z_xmm_xmmm128b32 = 3171,
  EVEX_Vcvtne2ps2bf16_ymm_k1z_ymm_ymmm256b32 = 3172,
  EVEX_Vcvtne2ps2bf16_zmm_k1z_zmm_zmmm512b32 = 3173,
  EVEX_Vpshrdvd_xmm_k1z_xmm_xmmm128b32 = 3174,
  EVEX_Vpshrdvd_ymm_k1z_ymm_ymmm256b32 = 3175,
  EVEX_Vpshrdvd_zmm_k1z_zmm_zmmm512b32 = 3176,
  EVEX_Vpshrdvq_xmm_k1z_xmm_xmmm128b64 = 3177,
  EVEX_Vpshrdvq_ymm_k1z_ymm_ymmm256b64 = 3178,
  EVEX_Vpshrdvq_zmm_k1z_zmm_zmmm512b64 = 3179,
  EVEX_Vpermi2b_xmm_k1z_xmm_xmmm128 = 3180,
  EVEX_Vpermi2b_ymm_k1z_ymm_ymmm256 = 3181,
  EVEX_Vpermi2b_zmm_k1z_zmm_zmmm512 = 3182,
  EVEX_Vpermi2w_xmm_k1z_xmm_xmmm128 = 3183,
  EVEX_Vpermi2w_ymm_k1z_ymm_ymmm256 = 3184,
  EVEX_Vpermi2w_zmm_k1z_zmm_zmmm512 = 3185,
  EVEX_Vpermi2d_xmm_k1z_xmm_xmmm128b32 = 3186,
  EVEX_Vpermi2d_ymm_k1z_ymm_ymmm256b32 = 3187,
  EVEX_Vpermi2d_zmm_k1z_zmm_zmmm512b32 = 3188,
  EVEX_Vpermi2q_xmm_k1z_xmm_xmmm128b64 = 3189,
  EVEX_Vpermi2q_ymm_k1z_ymm_ymmm256b64 = 3190,
  EVEX_Vpermi2q_zmm_k1z_zmm_zmmm512b64 = 3191,
  EVEX_Vpermi2ps_xmm_k1z_xmm_xmmm128b32 = 3192,
  EVEX_Vpermi2ps_ymm_k1z_ymm_ymmm256b32 = 3193,
  EVEX_Vpermi2ps_zmm_k1z_zmm_zmmm512b32 = 3194,
  EVEX_Vpermi2pd_xmm_k1z_xmm_xmmm128b64 = 3195,
  EVEX_Vpermi2pd_ymm_k1z_ymm_ymmm256b64 = 3196,
  EVEX_Vpermi2pd_zmm_k1z_zmm_zmmm512b64 = 3197,
  VEX_Vpbroadcastb_xmm_xmmm8 = 3198,
  VEX_Vpbroadcastb_ymm_xmmm8 = 3199,
  EVEX_Vpbroadcastb_xmm_k1z_xmmm8 = 3200,
  EVEX_Vpbroadcastb_ymm_k1z_xmmm8 = 3201,
  EVEX_Vpbroadcastb_zmm_k1z_xmmm8 = 3202,
  VEX_Vpbroadcastw_xmm_xmmm16 = 3203,
  VEX_Vpbroadcastw_ymm_xmmm16 = 3204,
  EVEX_Vpbroadcastw_xmm_k1z_xmmm16 = 3205,
  EVEX_Vpbroadcastw_ymm_k1z_xmmm16 = 3206,
  EVEX_Vpbroadcastw_zmm_k1z_xmmm16 = 3207,
  EVEX_Vpbroadcastb_xmm_k1z_r32 = 3208,
  EVEX_Vpbroadcastb_ymm_k1z_r32 = 3209,
  EVEX_Vpbroadcastb_zmm_k1z_r32 = 3210,
  EVEX_Vpbroadcastw_xmm_k1z_r32 = 3211,
  EVEX_Vpbroadcastw_ymm_k1z_r32 = 3212,
  EVEX_Vpbroadcastw_zmm_k1z_r32 = 3213,
  EVEX_Vpbroadcastd_xmm_k1z_r32 = 3214,
  EVEX_Vpbroadcastd_ymm_k1z_r32 = 3215,
  EVEX_Vpbroadcastd_zmm_k1z_r32 = 3216,
  EVEX_Vpbroadcastq_xmm_k1z_r64 = 3217,
  EVEX_Vpbroadcastq_ymm_k1z_r64 = 3218,
  EVEX_Vpbroadcastq_zmm_k1z_r64 = 3219,
  EVEX_Vpermt2b_xmm_k1z_xmm_xmmm128 = 3220,
  EVEX_Vpermt2b_ymm_k1z_ymm_ymmm256 = 3221,
  EVEX_Vpermt2b_zmm_k1z_zmm_zmmm512 = 3222,
  EVEX_Vpermt2w_xmm_k1z_xmm_xmmm128 = 3223,
  EVEX_Vpermt2w_ymm_k1z_ymm_ymmm256 = 3224,
  EVEX_Vpermt2w_zmm_k1z_zmm_zmmm512 = 3225,
  EVEX_Vpermt2d_xmm_k1z_xmm_xmmm128b32 = 3226,
  EVEX_Vpermt2d_ymm_k1z_ymm_ymmm256b32 = 3227,
  EVEX_Vpermt2d_zmm_k1z_zmm_zmmm512b32 = 3228,
  EVEX_Vpermt2q_xmm_k1z_xmm_xmmm128b64 = 3229,
  EVEX_Vpermt2q_ymm_k1z_ymm_ymmm256b64 = 3230,
  EVEX_Vpermt2q_zmm_k1z_zmm_zmmm512b64 = 3231,
  EVEX_Vpermt2ps_xmm_k1z_xmm_xmmm128b32 = 3232,
  EVEX_Vpermt2ps_ymm_k1z_ymm_ymmm256b32 = 3233,
  EVEX_Vpermt2ps_zmm_k1z_zmm_zmmm512b32 = 3234,
  EVEX_Vpermt2pd_xmm_k1z_xmm_xmmm128b64 = 3235,
  EVEX_Vpermt2pd_ymm_k1z_ymm_ymmm256b64 = 3236,
  EVEX_Vpermt2pd_zmm_k1z_zmm_zmmm512b64 = 3237,
  Invept_r32_m128 = 3238,
  Invept_r64_m128 = 3239,
  Invvpid_r32_m128 = 3240,
  Invvpid_r64_m128 = 3241,
  Invpcid_r32_m128 = 3242,
  Invpcid_r64_m128 = 3243,
  EVEX_Vpmultishiftqb_xmm_k1z_xmm_xmmm128b64 = 3244,
  EVEX_Vpmultishiftqb_ymm_k1z_ymm_ymmm256b64 = 3245,
  EVEX_Vpmultishiftqb_zmm_k1z_zmm_zmmm512b64 = 3246,
  EVEX_Vexpandps_xmm_k1z_xmmm128 = 3247,
  EVEX_Vexpandps_ymm_k1z_ymmm256 = 3248,
  EVEX_Vexpandps_zmm_k1z_zmmm512 = 3249,
  EVEX_Vexpandpd_xmm_k1z_xmmm128 = 3250,
  EVEX_Vexpandpd_ymm_k1z_ymmm256 = 3251,
  EVEX_Vexpandpd_zmm_k1z_zmmm512 = 3252,
  EVEX_Vpexpandd_xmm_k1z_xmmm128 = 3253,
  EVEX_Vpexpandd_ymm_k1z_ymmm256 = 3254,
  EVEX_Vpexpandd_zmm_k1z_zmmm512 = 3255,
  EVEX_Vpexpandq_xmm_k1z_xmmm128 = 3256,
  EVEX_Vpexpandq_ymm_k1z_ymmm256 = 3257,
  EVEX_Vpexpandq_zmm_k1z_zmmm512 = 3258,
  EVEX_Vcompressps_xmmm128_k1z_xmm = 3259,
  EVEX_Vcompressps_ymmm256_k1z_ymm = 3260,
  EVEX_Vcompressps_zmmm512_k1z_zmm = 3261,
  EVEX_Vcompresspd_xmmm128_k1z_xmm = 3262,
  EVEX_Vcompresspd_ymmm256_k1z_ymm = 3263,
  EVEX_Vcompresspd_zmmm512_k1z_zmm = 3264,
  EVEX_Vpcompressd_xmmm128_k1z_xmm = 3265,
  EVEX_Vpcompressd_ymmm256_k1z_ymm = 3266,
  EVEX_Vpcompressd_zmmm512_k1z_zmm = 3267,
  EVEX_Vpcompressq_xmmm128_k1z_xmm = 3268,
  EVEX_Vpcompressq_ymmm256_k1z_ymm = 3269,
  EVEX_Vpcompressq_zmmm512_k1z_zmm = 3270,
  VEX_Vpmaskmovd_xmm_xmm_m128 = 3271,
  VEX_Vpmaskmovd_ymm_ymm_m256 = 3272,
  VEX_Vpmaskmovq_xmm_xmm_m128 = 3273,
  VEX_Vpmaskmovq_ymm_ymm_m256 = 3274,
  EVEX_Vpermb_xmm_k1z_xmm_xmmm128 = 3275,
  EVEX_Vpermb_ymm_k1z_ymm_ymmm256 = 3276,
  EVEX_Vpermb_zmm_k1z_zmm_zmmm512 = 3277,
  EVEX_Vpermw_xmm_k1z_xmm_xmmm128 = 3278,
  EVEX_Vpermw_ymm_k1z_ymm_ymmm256 = 3279,
  EVEX_Vpermw_zmm_k1z_zmm_zmmm512 = 3280,
  VEX_Vpmaskmovd_m128_xmm_xmm = 3281,
  VEX_Vpmaskmovd_m256_ymm_ymm = 3282,
  VEX_Vpmaskmovq_m128_xmm_xmm = 3283,
  VEX_Vpmaskmovq_m256_ymm_ymm = 3284,
  EVEX_Vpshufbitqmb_kr_k1_xmm_xmmm128 = 3285,
  EVEX_Vpshufbitqmb_kr_k1_ymm_ymmm256 = 3286,
  EVEX_Vpshufbitqmb_kr_k1_zmm_zmmm512 = 3287,
  VEX_Vpgatherdd_xmm_vm32x_xmm = 3288,
  VEX_Vpgatherdd_ymm_vm32y_ymm = 3289,
  VEX_Vpgatherdq_xmm_vm32x_xmm = 3290,
  VEX_Vpgatherdq_ymm_vm32x_ymm = 3291,
  EVEX_Vpgatherdd_xmm_k1_vm32x = 3292,
  EVEX_Vpgatherdd_ymm_k1_vm32y = 3293,
  EVEX_Vpgatherdd_zmm_k1_vm32z = 3294,
  EVEX_Vpgatherdq_xmm_k1_vm32x = 3295,
  EVEX_Vpgatherdq_ymm_k1_vm32x = 3296,
  EVEX_Vpgatherdq_zmm_k1_vm32y = 3297,
  VEX_Vpgatherqd_xmm_vm64x_xmm = 3298,
  VEX_Vpgatherqd_xmm_vm64y_xmm = 3299,
  VEX_Vpgatherqq_xmm_vm64x_xmm = 3300,
  VEX_Vpgatherqq_ymm_vm64y_ymm = 3301,
  EVEX_Vpgatherqd_xmm_k1_vm64x = 3302,
  EVEX_Vpgatherqd_xmm_k1_vm64y = 3303,
  EVEX_Vpgatherqd_ymm_k1_vm64z = 3304,
  EVEX_Vpgatherqq_xmm_k1_vm64x = 3305,
  EVEX_Vpgatherqq_ymm_k1_vm64y = 3306,
  EVEX_Vpgatherqq_zmm_k1_vm64z = 3307,
  VEX_Vgatherdps_xmm_vm32x_xmm = 3308,
  VEX_Vgatherdps_ymm_vm32y_ymm = 3309,
  VEX_Vgatherdpd_xmm_vm32x_xmm = 3310,
  VEX_Vgatherdpd_ymm_vm32x_ymm = 3311,
  EVEX_Vgatherdps_xmm_k1_vm32x = 3312,
  EVEX_Vgatherdps_ymm_k1_vm32y = 3313,
  EVEX_Vgatherdps_zmm_k1_vm32z = 3314,
  EVEX_Vgatherdpd_xmm_k1_vm32x = 3315,
  EVEX_Vgatherdpd_ymm_k1_vm32x = 3316,
  EVEX_Vgatherdpd_zmm_k1_vm32y = 3317,
  VEX_Vgatherqps_xmm_vm64x_xmm = 3318,
  VEX_Vgatherqps_xmm_vm64y_xmm = 3319,
  VEX_Vgatherqpd_xmm_vm64x_xmm = 3320,
  VEX_Vgatherqpd_ymm_vm64y_ymm = 3321,
  EVEX_Vgatherqps_xmm_k1_vm64x = 3322,
  EVEX_Vgatherqps_xmm_k1_vm64y = 3323,
  EVEX_Vgatherqps_ymm_k1_vm64z = 3324,
  EVEX_Vgatherqpd_xmm_k1_vm64x = 3325,
  EVEX_Vgatherqpd_ymm_k1_vm64y = 3326,
  EVEX_Vgatherqpd_zmm_k1_vm64z = 3327,
  VEX_Vfmaddsub132ps_xmm_xmm_xmmm128 = 3328,
  VEX_Vfmaddsub132ps_ymm_ymm_ymmm256 = 3329,
  VEX_Vfmaddsub132pd_xmm_xmm_xmmm128 = 3330,
  VEX_Vfmaddsub132pd_ymm_ymm_ymmm256 = 3331,
  EVEX_Vfmaddsub132ps_xmm_k1z_xmm_xmmm128b32 = 3332,
  EVEX_Vfmaddsub132ps_ymm_k1z_ymm_ymmm256b32 = 3333,
  EVEX_Vfmaddsub132ps_zmm_k1z_zmm_zmmm512b32_er = 3334,
  EVEX_Vfmaddsub132pd_xmm_k1z_xmm_xmmm128b64 = 3335,
  EVEX_Vfmaddsub132pd_ymm_k1z_ymm_ymmm256b64 = 3336,
  EVEX_Vfmaddsub132pd_zmm_k1z_zmm_zmmm512b64_er = 3337,
  VEX_Vfmsubadd132ps_xmm_xmm_xmmm128 = 3338,
  VEX_Vfmsubadd132ps_ymm_ymm_ymmm256 = 3339,
  VEX_Vfmsubadd132pd_xmm_xmm_xmmm128 = 3340,
  VEX_Vfmsubadd132pd_ymm_ymm_ymmm256 = 3341,
  EVEX_Vfmsubadd132ps_xmm_k1z_xmm_xmmm128b32 = 3342,
  EVEX_Vfmsubadd132ps_ymm_k1z_ymm_ymmm256b32 = 3343,
  EVEX_Vfmsubadd132ps_zmm_k1z_zmm_zmmm512b32_er = 3344,
  EVEX_Vfmsubadd132pd_xmm_k1z_xmm_xmmm128b64 = 3345,
  EVEX_Vfmsubadd132pd_ymm_k1z_ymm_ymmm256b64 = 3346,
  EVEX_Vfmsubadd132pd_zmm_k1z_zmm_zmmm512b64_er = 3347,
  VEX_Vfmadd132ps_xmm_xmm_xmmm128 = 3348,
  VEX_Vfmadd132ps_ymm_ymm_ymmm256 = 3349,
  VEX_Vfmadd132pd_xmm_xmm_xmmm128 = 3350,
  VEX_Vfmadd132pd_ymm_ymm_ymmm256 = 3351,
  EVEX_Vfmadd132ps_xmm_k1z_xmm_xmmm128b32 = 3352,
  EVEX_Vfmadd132ps_ymm_k1z_ymm_ymmm256b32 = 3353,
  EVEX_Vfmadd132ps_zmm_k1z_zmm_zmmm512b32_er = 3354,
  EVEX_Vfmadd132pd_xmm_k1z_xmm_xmmm128b64 = 3355,
  EVEX_Vfmadd132pd_ymm_k1z_ymm_ymmm256b64 = 3356,
  EVEX_Vfmadd132pd_zmm_k1z_zmm_zmmm512b64_er = 3357,
  VEX_Vfmadd132ss_xmm_xmm_xmmm32 = 3358,
  VEX_Vfmadd132sd_xmm_xmm_xmmm64 = 3359,
  EVEX_Vfmadd132ss_xmm_k1z_xmm_xmmm32_er = 3360,
  EVEX_Vfmadd132sd_xmm_k1z_xmm_xmmm64_er = 3361,
  VEX_Vfmsub132ps_xmm_xmm_xmmm128 = 3362,
  VEX_Vfmsub132ps_ymm_ymm_ymmm256 = 3363,
  VEX_Vfmsub132pd_xmm_xmm_xmmm128 = 3364,
  VEX_Vfmsub132pd_ymm_ymm_ymmm256 = 3365,
  EVEX_Vfmsub132ps_xmm_k1z_xmm_xmmm128b32 = 3366,
  EVEX_Vfmsub132ps_ymm_k1z_ymm_ymmm256b32 = 3367,
  EVEX_Vfmsub132ps_zmm_k1z_zmm_zmmm512b32_er = 3368,
  EVEX_Vfmsub132pd_xmm_k1z_xmm_xmmm128b64 = 3369,
  EVEX_Vfmsub132pd_ymm_k1z_ymm_ymmm256b64 = 3370,
  EVEX_Vfmsub132pd_zmm_k1z_zmm_zmmm512b64_er = 3371,
  EVEX_V4fmaddps_zmm_k1z_zmmp3_m128 = 3372,
  VEX_Vfmsub132ss_xmm_xmm_xmmm32 = 3373,
  VEX_Vfmsub132sd_xmm_xmm_xmmm64 = 3374,
  EVEX_Vfmsub132ss_xmm_k1z_xmm_xmmm32_er = 3375,
  EVEX_Vfmsub132sd_xmm_k1z_xmm_xmmm64_er = 3376,
  EVEX_V4fmaddss_xmm_k1z_xmmp3_m128 = 3377,
  VEX_Vfnmadd132ps_xmm_xmm_xmmm128 = 3378,
  VEX_Vfnmadd132ps_ymm_ymm_ymmm256 = 3379,
  VEX_Vfnmadd132pd_xmm_xmm_xmmm128 = 3380,
  VEX_Vfnmadd132pd_ymm_ymm_ymmm256 = 3381,
  EVEX_Vfnmadd132ps_xmm_k1z_xmm_xmmm128b32 = 3382,
  EVEX_Vfnmadd132ps_ymm_k1z_ymm_ymmm256b32 = 3383,
  EVEX_Vfnmadd132ps_zmm_k1z_zmm_zmmm512b32_er = 3384,
  EVEX_Vfnmadd132pd_xmm_k1z_xmm_xmmm128b64 = 3385,
  EVEX_Vfnmadd132pd_ymm_k1z_ymm_ymmm256b64 = 3386,
  EVEX_Vfnmadd132pd_zmm_k1z_zmm_zmmm512b64_er = 3387,
  VEX_Vfnmadd132ss_xmm_xmm_xmmm32 = 3388,
  VEX_Vfnmadd132sd_xmm_xmm_xmmm64 = 3389,
  EVEX_Vfnmadd132ss_xmm_k1z_xmm_xmmm32_er = 3390,
  EVEX_Vfnmadd132sd_xmm_k1z_xmm_xmmm64_er = 3391,
  VEX_Vfnmsub132ps_xmm_xmm_xmmm128 = 3392,
  VEX_Vfnmsub132ps_ymm_ymm_ymmm256 = 3393,
  VEX_Vfnmsub132pd_xmm_xmm_xmmm128 = 3394,
  VEX_Vfnmsub132pd_ymm_ymm_ymmm256 = 3395,
  EVEX_Vfnmsub132ps_xmm_k1z_xmm_xmmm128b32 = 3396,
  EVEX_Vfnmsub132ps_ymm_k1z_ymm_ymmm256b32 = 3397,
  EVEX_Vfnmsub132ps_zmm_k1z_zmm_zmmm512b32_er = 3398,
  EVEX_Vfnmsub132pd_xmm_k1z_xmm_xmmm128b64 = 3399,
  EVEX_Vfnmsub132pd_ymm_k1z_ymm_ymmm256b64 = 3400,
  EVEX_Vfnmsub132pd_zmm_k1z_zmm_zmmm512b64_er = 3401,
  VEX_Vfnmsub132ss_xmm_xmm_xmmm32 = 3402,
  VEX_Vfnmsub132sd_xmm_xmm_xmmm64 = 3403,
  EVEX_Vfnmsub132ss_xmm_k1z_xmm_xmmm32_er = 3404,
  EVEX_Vfnmsub132sd_xmm_k1z_xmm_xmmm64_er = 3405,
  EVEX_Vpscatterdd_vm32x_k1_xmm = 3406,
  EVEX_Vpscatterdd_vm32y_k1_ymm = 3407,
  EVEX_Vpscatterdd_vm32z_k1_zmm = 3408,
  EVEX_Vpscatterdq_vm32x_k1_xmm = 3409,
  EVEX_Vpscatterdq_vm32x_k1_ymm = 3410,
  EVEX_Vpscatterdq_vm32y_k1_zmm = 3411,
  EVEX_Vpscatterqd_vm64x_k1_xmm = 3412,
  EVEX_Vpscatterqd_vm64y_k1_xmm = 3413,
  EVEX_Vpscatterqd_vm64z_k1_ymm = 3414,
  EVEX_Vpscatterqq_vm64x_k1_xmm = 3415,
  EVEX_Vpscatterqq_vm64y_k1_ymm = 3416,
  EVEX_Vpscatterqq_vm64z_k1_zmm = 3417,
  EVEX_Vscatterdps_vm32x_k1_xmm = 3418,
  EVEX_Vscatterdps_vm32y_k1_ymm = 3419,
  EVEX_Vscatterdps_vm32z_k1_zmm = 3420,
  EVEX_Vscatterdpd_vm32x_k1_xmm = 3421,
  EVEX_Vscatterdpd_vm32x_k1_ymm = 3422,
  EVEX_Vscatterdpd_vm32y_k1_zmm = 3423,
  EVEX_Vscatterqps_vm64x_k1_xmm = 3424,
  EVEX_Vscatterqps_vm64y_k1_xmm = 3425,
  EVEX_Vscatterqps_vm64z_k1_ymm = 3426,
  EVEX_Vscatterqpd_vm64x_k1_xmm = 3427,
  EVEX_Vscatterqpd_vm64y_k1_ymm = 3428,
  EVEX_Vscatterqpd_vm64z_k1_zmm = 3429,
  VEX_Vfmaddsub213ps_xmm_xmm_xmmm128 = 3430,
  VEX_Vfmaddsub213ps_ymm_ymm_ymmm256 = 3431,
  VEX_Vfmaddsub213pd_xmm_xmm_xmmm128 = 3432,
  VEX_Vfmaddsub213pd_ymm_ymm_ymmm256 = 3433,
  EVEX_Vfmaddsub213ps_xmm_k1z_xmm_xmmm128b32 = 3434,
  EVEX_Vfmaddsub213ps_ymm_k1z_ymm_ymmm256b32 = 3435,
  EVEX_Vfmaddsub213ps_zmm_k1z_zmm_zmmm512b32_er = 3436,
  EVEX_Vfmaddsub213pd_xmm_k1z_xmm_xmmm128b64 = 3437,
  EVEX_Vfmaddsub213pd_ymm_k1z_ymm_ymmm256b64 = 3438,
  EVEX_Vfmaddsub213pd_zmm_k1z_zmm_zmmm512b64_er = 3439,
  VEX_Vfmsubadd213ps_xmm_xmm_xmmm128 = 3440,
  VEX_Vfmsubadd213ps_ymm_ymm_ymmm256 = 3441,
  VEX_Vfmsubadd213pd_xmm_xmm_xmmm128 = 3442,
  VEX_Vfmsubadd213pd_ymm_ymm_ymmm256 = 3443,
  EVEX_Vfmsubadd213ps_xmm_k1z_xmm_xmmm128b32 = 3444,
  EVEX_Vfmsubadd213ps_ymm_k1z_ymm_ymmm256b32 = 3445,
  EVEX_Vfmsubadd213ps_zmm_k1z_zmm_zmmm512b32_er = 3446,
  EVEX_Vfmsubadd213pd_xmm_k1z_xmm_xmmm128b64 = 3447,
  EVEX_Vfmsubadd213pd_ymm_k1z_ymm_ymmm256b64 = 3448,
  EVEX_Vfmsubadd213pd_zmm_k1z_zmm_zmmm512b64_er = 3449,
  VEX_Vfmadd213ps_xmm_xmm_xmmm128 = 3450,
  VEX_Vfmadd213ps_ymm_ymm_ymmm256 = 3451,
  VEX_Vfmadd213pd_xmm_xmm_xmmm128 = 3452,
  VEX_Vfmadd213pd_ymm_ymm_ymmm256 = 3453,
  EVEX_Vfmadd213ps_xmm_k1z_xmm_xmmm128b32 = 3454,
  EVEX_Vfmadd213ps_ymm_k1z_ymm_ymmm256b32 = 3455,
  EVEX_Vfmadd213ps_zmm_k1z_zmm_zmmm512b32_er = 3456,
  EVEX_Vfmadd213pd_xmm_k1z_xmm_xmmm128b64 = 3457,
  EVEX_Vfmadd213pd_ymm_k1z_ymm_ymmm256b64 = 3458,
  EVEX_Vfmadd213pd_zmm_k1z_zmm_zmmm512b64_er = 3459,
  VEX_Vfmadd213ss_xmm_xmm_xmmm32 = 3460,
  VEX_Vfmadd213sd_xmm_xmm_xmmm64 = 3461,
  EVEX_Vfmadd213ss_xmm_k1z_xmm_xmmm32_er = 3462,
  EVEX_Vfmadd213sd_xmm_k1z_xmm_xmmm64_er = 3463,
  VEX_Vfmsub213ps_xmm_xmm_xmmm128 = 3464,
  VEX_Vfmsub213ps_ymm_ymm_ymmm256 = 3465,
  VEX_Vfmsub213pd_xmm_xmm_xmmm128 = 3466,
  VEX_Vfmsub213pd_ymm_ymm_ymmm256 = 3467,
  EVEX_Vfmsub213ps_xmm_k1z_xmm_xmmm128b32 = 3468,
  EVEX_Vfmsub213ps_ymm_k1z_ymm_ymmm256b32 = 3469,
  EVEX_Vfmsub213ps_zmm_k1z_zmm_zmmm512b32_er = 3470,
  EVEX_Vfmsub213pd_xmm_k1z_xmm_xmmm128b64 = 3471,
  EVEX_Vfmsub213pd_ymm_k1z_ymm_ymmm256b64 = 3472,
  EVEX_Vfmsub213pd_zmm_k1z_zmm_zmmm512b64_er = 3473,
  EVEX_V4fnmaddps_zmm_k1z_zmmp3_m128 = 3474,
  VEX_Vfmsub213ss_xmm_xmm_xmmm32 = 3475,
  VEX_Vfmsub213sd_xmm_xmm_xmmm64 = 3476,
  EVEX_Vfmsub213ss_xmm_k1z_xmm_xmmm32_er = 3477,
  EVEX_Vfmsub213sd_xmm_k1z_xmm_xmmm64_er = 3478,
  EVEX_V4fnmaddss_xmm_k1z_xmmp3_m128 = 3479,
  VEX_Vfnmadd213ps_xmm_xmm_xmmm128 = 3480,
  VEX_Vfnmadd213ps_ymm_ymm_ymmm256 = 3481,
  VEX_Vfnmadd213pd_xmm_xmm_xmmm128 = 3482,
  VEX_Vfnmadd213pd_ymm_ymm_ymmm256 = 3483,
  EVEX_Vfnmadd213ps_xmm_k1z_xmm_xmmm128b32 = 3484,
  EVEX_Vfnmadd213ps_ymm_k1z_ymm_ymmm256b32 = 3485,
  EVEX_Vfnmadd213ps_zmm_k1z_zmm_zmmm512b32_er = 3486,
  EVEX_Vfnmadd213pd_xmm_k1z_xmm_xmmm128b64 = 3487,
  EVEX_Vfnmadd213pd_ymm_k1z_ymm_ymmm256b64 = 3488,
  EVEX_Vfnmadd213pd_zmm_k1z_zmm_zmmm512b64_er = 3489,
  VEX_Vfnmadd213ss_xmm_xmm_xmmm32 = 3490,
  VEX_Vfnmadd213sd_xmm_xmm_xmmm64 = 3491,
  EVEX_Vfnmadd213ss_xmm_k1z_xmm_xmmm32_er = 3492,
  EVEX_Vfnmadd213sd_xmm_k1z_xmm_xmmm64_er = 3493,
  VEX_Vfnmsub213ps_xmm_xmm_xmmm128 = 3494,
  VEX_Vfnmsub213ps_ymm_ymm_ymmm256 = 3495,
  VEX_Vfnmsub213pd_xmm_xmm_xmmm128 = 3496,
  VEX_Vfnmsub213pd_ymm_ymm_ymmm256 = 3497,
  EVEX_Vfnmsub213ps_xmm_k1z_xmm_xmmm128b32 = 3498,
  EVEX_Vfnmsub213ps_ymm_k1z_ymm_ymmm256b32 = 3499,
  EVEX_Vfnmsub213ps_zmm_k1z_zmm_zmmm512b32_er = 3500,
  EVEX_Vfnmsub213pd_xmm_k1z_xmm_xmmm128b64 = 3501,
  EVEX_Vfnmsub213pd_ymm_k1z_ymm_ymmm256b64 = 3502,
  EVEX_Vfnmsub213pd_zmm_k1z_zmm_zmmm512b64_er = 3503,
  VEX_Vfnmsub213ss_xmm_xmm_xmmm32 = 3504,
  VEX_Vfnmsub213sd_xmm_xmm_xmmm64 = 3505,
  EVEX_Vfnmsub213ss_xmm_k1z_xmm_xmmm32_er = 3506,
  EVEX_Vfnmsub213sd_xmm_k1z_xmm_xmmm64_er = 3507,
  EVEX_Vpmadd52luq_xmm_k1z_xmm_xmmm128b64 = 3508,
  EVEX_Vpmadd52luq_ymm_k1z_ymm_ymmm256b64 = 3509,
  EVEX_Vpmadd52luq_zmm_k1z_zmm_zmmm512b64 = 3510,
  EVEX_Vpmadd52huq_xmm_k1z_xmm_xmmm128b64 = 3511,
  EVEX_Vpmadd52huq_ymm_k1z_ymm_ymmm256b64 = 3512,
  EVEX_Vpmadd52huq_zmm_k1z_zmm_zmmm512b64 = 3513,
  VEX_Vfmaddsub231ps_xmm_xmm_xmmm128 = 3514,
  VEX_Vfmaddsub231ps_ymm_ymm_ymmm256 = 3515,
  VEX_Vfmaddsub231pd_xmm_xmm_xmmm128 = 3516,
  VEX_Vfmaddsub231pd_ymm_ymm_ymmm256 = 3517,
  EVEX_Vfmaddsub231ps_xmm_k1z_xmm_xmmm128b32 = 3518,
  EVEX_Vfmaddsub231ps_ymm_k1z_ymm_ymmm256b32 = 3519,
  EVEX_Vfmaddsub231ps_zmm_k1z_zmm_zmmm512b32_er = 3520,
  EVEX_Vfmaddsub231pd_xmm_k1z_xmm_xmmm128b64 = 3521,
  EVEX_Vfmaddsub231pd_ymm_k1z_ymm_ymmm256b64 = 3522,
  EVEX_Vfmaddsub231pd_zmm_k1z_zmm_zmmm512b64_er = 3523,
  VEX_Vfmsubadd231ps_xmm_xmm_xmmm128 = 3524,
  VEX_Vfmsubadd231ps_ymm_ymm_ymmm256 = 3525,
  VEX_Vfmsubadd231pd_xmm_xmm_xmmm128 = 3526,
  VEX_Vfmsubadd231pd_ymm_ymm_ymmm256 = 3527,
  EVEX_Vfmsubadd231ps_xmm_k1z_xmm_xmmm128b32 = 3528,
  EVEX_Vfmsubadd231ps_ymm_k1z_ymm_ymmm256b32 = 3529,
  EVEX_Vfmsubadd231ps_zmm_k1z_zmm_zmmm512b32_er = 3530,
  EVEX_Vfmsubadd231pd_xmm_k1z_xmm_xmmm128b64 = 3531,
  EVEX_Vfmsubadd231pd_ymm_k1z_ymm_ymmm256b64 = 3532,
  EVEX_Vfmsubadd231pd_zmm_k1z_zmm_zmmm512b64_er = 3533,
  VEX_Vfmadd231ps_xmm_xmm_xmmm128 = 3534,
  VEX_Vfmadd231ps_ymm_ymm_ymmm256 = 3535,
  VEX_Vfmadd231pd_xmm_xmm_xmmm128 = 3536,
  VEX_Vfmadd231pd_ymm_ymm_ymmm256 = 3537,
  EVEX_Vfmadd231ps_xmm_k1z_xmm_xmmm128b32 = 3538,
  EVEX_Vfmadd231ps_ymm_k1z_ymm_ymmm256b32 = 3539,
  EVEX_Vfmadd231ps_zmm_k1z_zmm_zmmm512b32_er = 3540,
  EVEX_Vfmadd231pd_xmm_k1z_xmm_xmmm128b64 = 3541,
  EVEX_Vfmadd231pd_ymm_k1z_ymm_ymmm256b64 = 3542,
  EVEX_Vfmadd231pd_zmm_k1z_zmm_zmmm512b64_er = 3543,
  VEX_Vfmadd231ss_xmm_xmm_xmmm32 = 3544,
  VEX_Vfmadd231sd_xmm_xmm_xmmm64 = 3545,
  EVEX_Vfmadd231ss_xmm_k1z_xmm_xmmm32_er = 3546,
  EVEX_Vfmadd231sd_xmm_k1z_xmm_xmmm64_er = 3547,
  VEX_Vfmsub231ps_xmm_xmm_xmmm128 = 3548,
  VEX_Vfmsub231ps_ymm_ymm_ymmm256 = 3549,
  VEX_Vfmsub231pd_xmm_xmm_xmmm128 = 3550,
  VEX_Vfmsub231pd_ymm_ymm_ymmm256 = 3551,
  EVEX_Vfmsub231ps_xmm_k1z_xmm_xmmm128b32 = 3552,
  EVEX_Vfmsub231ps_ymm_k1z_ymm_ymmm256b32 = 3553,
  EVEX_Vfmsub231ps_zmm_k1z_zmm_zmmm512b32_er = 3554,
  EVEX_Vfmsub231pd_xmm_k1z_xmm_xmmm128b64 = 3555,
  EVEX_Vfmsub231pd_ymm_k1z_ymm_ymmm256b64 = 3556,
  EVEX_Vfmsub231pd_zmm_k1z_zmm_zmmm512b64_er = 3557,
  VEX_Vfmsub231ss_xmm_xmm_xmmm32 = 3558,
  VEX_Vfmsub231sd_xmm_xmm_xmmm64 = 3559,
  EVEX_Vfmsub231ss_xmm_k1z_xmm_xmmm32_er = 3560,
  EVEX_Vfmsub231sd_xmm_k1z_xmm_xmmm64_er = 3561,
  VEX_Vfnmadd231ps_xmm_xmm_xmmm128 = 3562,
  VEX_Vfnmadd231ps_ymm_ymm_ymmm256 = 3563,
  VEX_Vfnmadd231pd_xmm_xmm_xmmm128 = 3564,
  VEX_Vfnmadd231pd_ymm_ymm_ymmm256 = 3565,
  EVEX_Vfnmadd231ps_xmm_k1z_xmm_xmmm128b32 = 3566,
  EVEX_Vfnmadd231ps_ymm_k1z_ymm_ymmm256b32 = 3567,
  EVEX_Vfnmadd231ps_zmm_k1z_zmm_zmmm512b32_er = 3568,
  EVEX_Vfnmadd231pd_xmm_k1z_xmm_xmmm128b64 = 3569,
  EVEX_Vfnmadd231pd_ymm_k1z_ymm_ymmm256b64 = 3570,
  EVEX_Vfnmadd231pd_zmm_k1z_zmm_zmmm512b64_er = 3571,
  VEX_Vfnmadd231ss_xmm_xmm_xmmm32 = 3572,
  VEX_Vfnmadd231sd_xmm_xmm_xmmm64 = 3573,
  EVEX_Vfnmadd231ss_xmm_k1z_xmm_xmmm32_er = 3574,
  EVEX_Vfnmadd231sd_xmm_k1z_xmm_xmmm64_er = 3575,
  VEX_Vfnmsub231ps_xmm_xmm_xmmm128 = 3576,
  VEX_Vfnmsub231ps_ymm_ymm_ymmm256 = 3577,
  VEX_Vfnmsub231pd_xmm_xmm_xmmm128 = 3578,
  VEX_Vfnmsub231pd_ymm_ymm_ymmm256 = 3579,
  EVEX_Vfnmsub231ps_xmm_k1z_xmm_xmmm128b32 = 3580,
  EVEX_Vfnmsub231ps_ymm_k1z_ymm_ymmm256b32 = 3581,
  EVEX_Vfnmsub231ps_zmm_k1z_zmm_zmmm512b32_er = 3582,
  EVEX_Vfnmsub231pd_xmm_k1z_xmm_xmmm128b64 = 3583,
  EVEX_Vfnmsub231pd_ymm_k1z_ymm_ymmm256b64 = 3584,
  EVEX_Vfnmsub231pd_zmm_k1z_zmm_zmmm512b64_er = 3585,
  VEX_Vfnmsub231ss_xmm_xmm_xmmm32 = 3586,
  VEX_Vfnmsub231sd_xmm_xmm_xmmm64 = 3587,
  EVEX_Vfnmsub231ss_xmm_k1z_xmm_xmmm32_er = 3588,
  EVEX_Vfnmsub231sd_xmm_k1z_xmm_xmmm64_er = 3589,
  EVEX_Vpconflictd_xmm_k1z_xmmm128b32 = 3590,
  EVEX_Vpconflictd_ymm_k1z_ymmm256b32 = 3591,
  EVEX_Vpconflictd_zmm_k1z_zmmm512b32 = 3592,
  EVEX_Vpconflictq_xmm_k1z_xmmm128b64 = 3593,
  EVEX_Vpconflictq_ymm_k1z_ymmm256b64 = 3594,
  EVEX_Vpconflictq_zmm_k1z_zmmm512b64 = 3595,
  EVEX_Vgatherpf0dps_vm32z_k1 = 3596,
  EVEX_Vgatherpf0dpd_vm32y_k1 = 3597,
  EVEX_Vgatherpf1dps_vm32z_k1 = 3598,
  EVEX_Vgatherpf1dpd_vm32y_k1 = 3599,
  EVEX_Vscatterpf0dps_vm32z_k1 = 3600,
  EVEX_Vscatterpf0dpd_vm32y_k1 = 3601,
  EVEX_Vscatterpf1dps_vm32z_k1 = 3602,
  EVEX_Vscatterpf1dpd_vm32y_k1 = 3603,
  EVEX_Vgatherpf0qps_vm64z_k1 = 3604,
  EVEX_Vgatherpf0qpd_vm64z_k1 = 3605,
  EVEX_Vgatherpf1qps_vm64z_k1 = 3606,
  EVEX_Vgatherpf1qpd_vm64z_k1 = 3607,
  EVEX_Vscatterpf0qps_vm64z_k1 = 3608,
  EVEX_Vscatterpf0qpd_vm64z_k1 = 3609,
  EVEX_Vscatterpf1qps_vm64z_k1 = 3610,
  EVEX_Vscatterpf1qpd_vm64z_k1 = 3611,
  Sha1nexte_xmm_xmmm128 = 3612,
  EVEX_Vexp2ps_zmm_k1z_zmmm512b32_sae = 3613,
  EVEX_Vexp2pd_zmm_k1z_zmmm512b64_sae = 3614,
  Sha1msg1_xmm_xmmm128 = 3615,
  Sha1msg2_xmm_xmmm128 = 3616,
  EVEX_Vrcp28ps_zmm_k1z_zmmm512b32_sae = 3617,
  EVEX_Vrcp28pd_zmm_k1z_zmmm512b64_sae = 3618,
  Sha256rnds2_xmm_xmmm128 = 3619,
  EVEX_Vrcp28ss_xmm_k1z_xmm_xmmm32_sae = 3620,
  EVEX_Vrcp28sd_xmm_k1z_xmm_xmmm64_sae = 3621,
  Sha256msg1_xmm_xmmm128 = 3622,
  EVEX_Vrsqrt28ps_zmm_k1z_zmmm512b32_sae = 3623,
  EVEX_Vrsqrt28pd_zmm_k1z_zmmm512b64_sae = 3624,
  Sha256msg2_xmm_xmmm128 = 3625,
  EVEX_Vrsqrt28ss_xmm_k1z_xmm_xmmm32_sae = 3626,
  EVEX_Vrsqrt28sd_xmm_k1z_xmm_xmmm64_sae = 3627,
  Gf2p8mulb_xmm_xmmm128 = 3628,
  VEX_Vgf2p8mulb_xmm_xmm_xmmm128 = 3629,
  VEX_Vgf2p8mulb_ymm_ymm_ymmm256 = 3630,
  EVEX_Vgf2p8mulb_xmm_k1z_xmm_xmmm128 = 3631,
  EVEX_Vgf2p8mulb_ymm_k1z_ymm_ymmm256 = 3632,
  EVEX_Vgf2p8mulb_zmm_k1z_zmm_zmmm512 = 3633,
  Aesimc_xmm_xmmm128 = 3634,
  VEX_Vaesimc_xmm_xmmm128 = 3635,
  Aesenc_xmm_xmmm128 = 3636,
  VEX_Vaesenc_xmm_xmm_xmmm128 = 3637,
  VEX_Vaesenc_ymm_ymm_ymmm256 = 3638,
  EVEX_Vaesenc_xmm_xmm_xmmm128 = 3639,
  EVEX_Vaesenc_ymm_ymm_ymmm256 = 3640,
  EVEX_Vaesenc_zmm_zmm_zmmm512 = 3641,
  Aesenclast_xmm_xmmm128 = 3642,
  VEX_Vaesenclast_xmm_xmm_xmmm128 = 3643,
  VEX_Vaesenclast_ymm_ymm_ymmm256 = 3644,
  EVEX_Vaesenclast_xmm_xmm_xmmm128 = 3645,
  EVEX_Vaesenclast_ymm_ymm_ymmm256 = 3646,
  EVEX_Vaesenclast_zmm_zmm_zmmm512 = 3647,
  Aesdec_xmm_xmmm128 = 3648,
  VEX_Vaesdec_xmm_xmm_xmmm128 = 3649,
  VEX_Vaesdec_ymm_ymm_ymmm256 = 3650,
  EVEX_Vaesdec_xmm_xmm_xmmm128 = 3651,
  EVEX_Vaesdec_ymm_ymm_ymmm256 = 3652,
  EVEX_Vaesdec_zmm_zmm_zmmm512 = 3653,
  Aesdeclast_xmm_xmmm128 = 3654,
  VEX_Vaesdeclast_xmm_xmm_xmmm128 = 3655,
  VEX_Vaesdeclast_ymm_ymm_ymmm256 = 3656,
  EVEX_Vaesdeclast_xmm_xmm_xmmm128 = 3657,
  EVEX_Vaesdeclast_ymm_ymm_ymmm256 = 3658,
  EVEX_Vaesdeclast_zmm_zmm_zmmm512 = 3659,
  Movbe_r16_m16 = 3660,
  Movbe_r32_m32 = 3661,
  Movbe_r64_m64 = 3662,
  Crc32_r32_rm8 = 3663,
  Crc32_r64_rm8 = 3664,
  Movbe_m16_r16 = 3665,
  Movbe_m32_r32 = 3666,
  Movbe_m64_r64 = 3667,
  Crc32_r32_rm16 = 3668,
  Crc32_r32_rm32 = 3669,
  Crc32_r64_rm64 = 3670,
  VEX_Andn_r32_r32_rm32 = 3671,
  VEX_Andn_r64_r64_rm64 = 3672,
  VEX_Blsr_r32_rm32 = 3673,
  VEX_Blsr_r64_rm64 = 3674,
  VEX_Blsmsk_r32_rm32 = 3675,
  VEX_Blsmsk_r64_rm64 = 3676,
  VEX_Blsi_r32_rm32 = 3677,
  VEX_Blsi_r64_rm64 = 3678,
  VEX_Bzhi_r32_rm32_r32 = 3679,
  VEX_Bzhi_r64_rm64_r64 = 3680,
  Wrussd_m32_r32 = 3681,
  Wrussq_m64_r64 = 3682,
  VEX_Pext_r32_r32_rm32 = 3683,
  VEX_Pext_r64_r64_rm64 = 3684,
  VEX_Pdep_r32_r32_rm32 = 3685,
  VEX_Pdep_r64_r64_rm64 = 3686,
  Wrssd_m32_r32 = 3687,
  Wrssq_m64_r64 = 3688,
  Adcx_r32_rm32 = 3689,
  Adcx_r64_rm64 = 3690,
  Adox_r32_rm32 = 3691,
  Adox_r64_rm64 = 3692,
  VEX_Mulx_r32_r32_rm32 = 3693,
  VEX_Mulx_r64_r64_rm64 = 3694,
  VEX_Bextr_r32_rm32_r32 = 3695,
  VEX_Bextr_r64_rm64_r64 = 3696,
  VEX_Shlx_r32_rm32_r32 = 3697,
  VEX_Shlx_r64_rm64_r64 = 3698,
  VEX_Sarx_r32_rm32_r32 = 3699,
  VEX_Sarx_r64_rm64_r64 = 3700,
  VEX_Shrx_r32_rm32_r32 = 3701,
  VEX_Shrx_r64_rm64_r64 = 3702,
  Movdir64b_r16_m512 = 3703,
  Movdir64b_r32_m512 = 3704,
  Movdir64b_r64_m512 = 3705,
  Enqcmds_r16_m512 = 3706,
  Enqcmds_r32_m512 = 3707,
  Enqcmds_r64_m512 = 3708,
  Enqcmd_r16_m512 = 3709,
  Enqcmd_r32_m512 = 3710,
  Enqcmd_r64_m512 = 3711,
  Movdiri_m32_r32 = 3712,
  Movdiri_m64_r64 = 3713,
  VEX_Vpermq_ymm_ymmm256_imm8 = 3714,
  EVEX_Vpermq_ymm_k1z_ymmm256b64_imm8 = 3715,
  EVEX_Vpermq_zmm_k1z_zmmm512b64_imm8 = 3716,
  VEX_Vpermpd_ymm_ymmm256_imm8 = 3717,
  EVEX_Vpermpd_ymm_k1z_ymmm256b64_imm8 = 3718,
  EVEX_Vpermpd_zmm_k1z_zmmm512b64_imm8 = 3719,
  VEX_Vpblendd_xmm_xmm_xmmm128_imm8 = 3720,
  VEX_Vpblendd_ymm_ymm_ymmm256_imm8 = 3721,
  EVEX_Valignd_xmm_k1z_xmm_xmmm128b32_imm8 = 3722,
  EVEX_Valignd_ymm_k1z_ymm_ymmm256b32_imm8 = 3723,
  EVEX_Valignd_zmm_k1z_zmm_zmmm512b32_imm8 = 3724,
  EVEX_Valignq_xmm_k1z_xmm_xmmm128b64_imm8 = 3725,
  EVEX_Valignq_ymm_k1z_ymm_ymmm256b64_imm8 = 3726,
  EVEX_Valignq_zmm_k1z_zmm_zmmm512b64_imm8 = 3727,
  VEX_Vpermilps_xmm_xmmm128_imm8 = 3728,
  VEX_Vpermilps_ymm_ymmm256_imm8 = 3729,
  EVEX_Vpermilps_xmm_k1z_xmmm128b32_imm8 = 3730,
  EVEX_Vpermilps_ymm_k1z_ymmm256b32_imm8 = 3731,
  EVEX_Vpermilps_zmm_k1z_zmmm512b32_imm8 = 3732,
  VEX_Vpermilpd_xmm_xmmm128_imm8 = 3733,
  VEX_Vpermilpd_ymm_ymmm256_imm8 = 3734,
  EVEX_Vpermilpd_xmm_k1z_xmmm128b64_imm8 = 3735,
  EVEX_Vpermilpd_ymm_k1z_ymmm256b64_imm8 = 3736,
  EVEX_Vpermilpd_zmm_k1z_zmmm512b64_imm8 = 3737,
  VEX_Vperm2f128_ymm_ymm_ymmm256_imm8 = 3738,
  Roundps_xmm_xmmm128_imm8 = 3739,
  VEX_Vroundps_xmm_xmmm128_imm8 = 3740,
  VEX_Vroundps_ymm_ymmm256_imm8 = 3741,
  EVEX_Vrndscaleps_xmm_k1z_xmmm128b32_imm8 = 3742,
  EVEX_Vrndscaleps_ymm_k1z_ymmm256b32_imm8 = 3743,
  EVEX_Vrndscaleps_zmm_k1z_zmmm512b32_imm8_sae = 3744,
  Roundpd_xmm_xmmm128_imm8 = 3745,
  VEX_Vroundpd_xmm_xmmm128_imm8 = 3746,
  VEX_Vroundpd_ymm_ymmm256_imm8 = 3747,
  EVEX_Vrndscalepd_xmm_k1z_xmmm128b64_imm8 = 3748,
  EVEX_Vrndscalepd_ymm_k1z_ymmm256b64_imm8 = 3749,
  EVEX_Vrndscalepd_zmm_k1z_zmmm512b64_imm8_sae = 3750,
  Roundss_xmm_xmmm32_imm8 = 3751,
  VEX_Vroundss_xmm_xmm_xmmm32_imm8 = 3752,
  EVEX_Vrndscaless_xmm_k1z_xmm_xmmm32_imm8_sae = 3753,
  Roundsd_xmm_xmmm64_imm8 = 3754,
  VEX_Vroundsd_xmm_xmm_xmmm64_imm8 = 3755,
  EVEX_Vrndscalesd_xmm_k1z_xmm_xmmm64_imm8_sae = 3756,
  Blendps_xmm_xmmm128_imm8 = 3757,
  VEX_Vblendps_xmm_xmm_xmmm128_imm8 = 3758,
  VEX_Vblendps_ymm_ymm_ymmm256_imm8 = 3759,
  Blendpd_xmm_xmmm128_imm8 = 3760,
  VEX_Vblendpd_xmm_xmm_xmmm128_imm8 = 3761,
  VEX_Vblendpd_ymm_ymm_ymmm256_imm8 = 3762,
  Pblendw_xmm_xmmm128_imm8 = 3763,
  VEX_Vpblendw_xmm_xmm_xmmm128_imm8 = 3764,
  VEX_Vpblendw_ymm_ymm_ymmm256_imm8 = 3765,
  Palignr_mm_mmm64_imm8 = 3766,
  Palignr_xmm_xmmm128_imm8 = 3767,
  VEX_Vpalignr_xmm_xmm_xmmm128_imm8 = 3768,
  VEX_Vpalignr_ymm_ymm_ymmm256_imm8 = 3769,
  EVEX_Vpalignr_xmm_k1z_xmm_xmmm128_imm8 = 3770,
  EVEX_Vpalignr_ymm_k1z_ymm_ymmm256_imm8 = 3771,
  EVEX_Vpalignr_zmm_k1z_zmm_zmmm512_imm8 = 3772,
  Pextrb_r32m8_xmm_imm8 = 3773,
  Pextrb_r64m8_xmm_imm8 = 3774,
  VEX_Vpextrb_r32m8_xmm_imm8 = 3775,
  VEX_Vpextrb_r64m8_xmm_imm8 = 3776,
  EVEX_Vpextrb_r32m8_xmm_imm8 = 3777,
  EVEX_Vpextrb_r64m8_xmm_imm8 = 3778,
  Pextrw_r32m16_xmm_imm8 = 3779,
  Pextrw_r64m16_xmm_imm8 = 3780,
  VEX_Vpextrw_r32m16_xmm_imm8 = 3781,
  VEX_Vpextrw_r64m16_xmm_imm8 = 3782,
  EVEX_Vpextrw_r32m16_xmm_imm8 = 3783,
  EVEX_Vpextrw_r64m16_xmm_imm8 = 3784,
  Pextrd_rm32_xmm_imm8 = 3785,
  Pextrq_rm64_xmm_imm8 = 3786,
  VEX_Vpextrd_rm32_xmm_imm8 = 3787,
  VEX_Vpextrq_rm64_xmm_imm8 = 3788,
  EVEX_Vpextrd_rm32_xmm_imm8 = 3789,
  EVEX_Vpextrq_rm64_xmm_imm8 = 3790,
  Extractps_rm32_xmm_imm8 = 3791,
  Extractps_r64m32_xmm_imm8 = 3792,
  VEX_Vextractps_rm32_xmm_imm8 = 3793,
  VEX_Vextractps_r64m32_xmm_imm8 = 3794,
  EVEX_Vextractps_rm32_xmm_imm8 = 3795,
  EVEX_Vextractps_r64m32_xmm_imm8 = 3796,
  VEX_Vinsertf128_ymm_ymm_xmmm128_imm8 = 3797,
  EVEX_Vinsertf32x4_ymm_k1z_ymm_xmmm128_imm8 = 3798,
  EVEX_Vinsertf32x4_zmm_k1z_zmm_xmmm128_imm8 = 3799,
  EVEX_Vinsertf64x2_ymm_k1z_ymm_xmmm128_imm8 = 3800,
  EVEX_Vinsertf64x2_zmm_k1z_zmm_xmmm128_imm8 = 3801,
  VEX_Vextractf128_xmmm128_ymm_imm8 = 3802,
  EVEX_Vextractf32x4_xmmm128_k1z_ymm_imm8 = 3803,
  EVEX_Vextractf32x4_xmmm128_k1z_zmm_imm8 = 3804,
  EVEX_Vextractf64x2_xmmm128_k1z_ymm_imm8 = 3805,
  EVEX_Vextractf64x2_xmmm128_k1z_zmm_imm8 = 3806,
  EVEX_Vinsertf32x8_zmm_k1z_zmm_ymmm256_imm8 = 3807,
  EVEX_Vinsertf64x4_zmm_k1z_zmm_ymmm256_imm8 = 3808,
  EVEX_Vextractf32x8_ymmm256_k1z_zmm_imm8 = 3809,
  EVEX_Vextractf64x4_ymmm256_k1z_zmm_imm8 = 3810,
  VEX_Vcvtps2ph_xmmm64_xmm_imm8 = 3811,
  VEX_Vcvtps2ph_xmmm128_ymm_imm8 = 3812,
  EVEX_Vcvtps2ph_xmmm64_k1z_xmm_imm8 = 3813,
  EVEX_Vcvtps2ph_xmmm128_k1z_ymm_imm8 = 3814,
  EVEX_Vcvtps2ph_ymmm256_k1z_zmm_imm8_sae = 3815,
  EVEX_Vpcmpud_kr_k1_xmm_xmmm128b32_imm8 = 3816,
  EVEX_Vpcmpud_kr_k1_ymm_ymmm256b32_imm8 = 3817,
  EVEX_Vpcmpud_kr_k1_zmm_zmmm512b32_imm8 = 3818,
  EVEX_Vpcmpuq_kr_k1_xmm_xmmm128b64_imm8 = 3819,
  EVEX_Vpcmpuq_kr_k1_ymm_ymmm256b64_imm8 = 3820,
  EVEX_Vpcmpuq_kr_k1_zmm_zmmm512b64_imm8 = 3821,
  EVEX_Vpcmpd_kr_k1_xmm_xmmm128b32_imm8 = 3822,
  EVEX_Vpcmpd_kr_k1_ymm_ymmm256b32_imm8 = 3823,
  EVEX_Vpcmpd_kr_k1_zmm_zmmm512b32_imm8 = 3824,
  EVEX_Vpcmpq_kr_k1_xmm_xmmm128b64_imm8 = 3825,
  EVEX_Vpcmpq_kr_k1_ymm_ymmm256b64_imm8 = 3826,
  EVEX_Vpcmpq_kr_k1_zmm_zmmm512b64_imm8 = 3827,
  Pinsrb_xmm_r32m8_imm8 = 3828,
  Pinsrb_xmm_r64m8_imm8 = 3829,
  VEX_Vpinsrb_xmm_xmm_r32m8_imm8 = 3830,
  VEX_Vpinsrb_xmm_xmm_r64m8_imm8 = 3831,
  EVEX_Vpinsrb_xmm_xmm_r32m8_imm8 = 3832,
  EVEX_Vpinsrb_xmm_xmm_r64m8_imm8 = 3833,
  Insertps_xmm_xmmm32_imm8 = 3834,
  VEX_Vinsertps_xmm_xmm_xmmm32_imm8 = 3835,
  EVEX_Vinsertps_xmm_xmm_xmmm32_imm8 = 3836,
  Pinsrd_xmm_rm32_imm8 = 3837,
  Pinsrq_xmm_rm64_imm8 = 3838,
  VEX_Vpinsrd_xmm_xmm_rm32_imm8 = 3839,
  VEX_Vpinsrq_xmm_xmm_rm64_imm8 = 3840,
  EVEX_Vpinsrd_xmm_xmm_rm32_imm8 = 3841,
  EVEX_Vpinsrq_xmm_xmm_rm64_imm8 = 3842,
  EVEX_Vshuff32x4_ymm_k1z_ymm_ymmm256b32_imm8 = 3843,
  EVEX_Vshuff32x4_zmm_k1z_zmm_zmmm512b32_imm8 = 3844,
  EVEX_Vshuff64x2_ymm_k1z_ymm_ymmm256b64_imm8 = 3845,
  EVEX_Vshuff64x2_zmm_k1z_zmm_zmmm512b64_imm8 = 3846,
  EVEX_Vpternlogd_xmm_k1z_xmm_xmmm128b32_imm8 = 3847,
  EVEX_Vpternlogd_ymm_k1z_ymm_ymmm256b32_imm8 = 3848,
  EVEX_Vpternlogd_zmm_k1z_zmm_zmmm512b32_imm8 = 3849,
  EVEX_Vpternlogq_xmm_k1z_xmm_xmmm128b64_imm8 = 3850,
  EVEX_Vpternlogq_ymm_k1z_ymm_ymmm256b64_imm8 = 3851,
  EVEX_Vpternlogq_zmm_k1z_zmm_zmmm512b64_imm8 = 3852,
  EVEX_Vgetmantps_xmm_k1z_xmmm128b32_imm8 = 3853,
  EVEX_Vgetmantps_ymm_k1z_ymmm256b32_imm8 = 3854,
  EVEX_Vgetmantps_zmm_k1z_zmmm512b32_imm8_sae = 3855,
  EVEX_Vgetmantpd_xmm_k1z_xmmm128b64_imm8 = 3856,
  EVEX_Vgetmantpd_ymm_k1z_ymmm256b64_imm8 = 3857,
  EVEX_Vgetmantpd_zmm_k1z_zmmm512b64_imm8_sae = 3858,
  EVEX_Vgetmantss_xmm_k1z_xmm_xmmm32_imm8_sae = 3859,
  EVEX_Vgetmantsd_xmm_k1z_xmm_xmmm64_imm8_sae = 3860,
  VEX_Kshiftrb_kr_kr_imm8 = 3861,
  VEX_Kshiftrw_kr_kr_imm8 = 3862,
  VEX_Kshiftrd_kr_kr_imm8 = 3863,
  VEX_Kshiftrq_kr_kr_imm8 = 3864,
  VEX_Kshiftlb_kr_kr_imm8 = 3865,
  VEX_Kshiftlw_kr_kr_imm8 = 3866,
  VEX_Kshiftld_kr_kr_imm8 = 3867,
  VEX_Kshiftlq_kr_kr_imm8 = 3868,
  VEX_Vinserti128_ymm_ymm_xmmm128_imm8 = 3869,
  EVEX_Vinserti32x4_ymm_k1z_ymm_xmmm128_imm8 = 3870,
  EVEX_Vinserti32x4_zmm_k1z_zmm_xmmm128_imm8 = 3871,
  EVEX_Vinserti64x2_ymm_k1z_ymm_xmmm128_imm8 = 3872,
  EVEX_Vinserti64x2_zmm_k1z_zmm_xmmm128_imm8 = 3873,
  VEX_Vextracti128_xmmm128_ymm_imm8 = 3874,
  EVEX_Vextracti32x4_xmmm128_k1z_ymm_imm8 = 3875,
  EVEX_Vextracti32x4_xmmm128_k1z_zmm_imm8 = 3876,
  EVEX_Vextracti64x2_xmmm128_k1z_ymm_imm8 = 3877,
  EVEX_Vextracti64x2_xmmm128_k1z_zmm_imm8 = 3878,
  EVEX_Vinserti32x8_zmm_k1z_zmm_ymmm256_imm8 = 3879,
  EVEX_Vinserti64x4_zmm_k1z_zmm_ymmm256_imm8 = 3880,
  EVEX_Vextracti32x8_ymmm256_k1z_zmm_imm8 = 3881,
  EVEX_Vextracti64x4_ymmm256_k1z_zmm_imm8 = 3882,
  EVEX_Vpcmpub_kr_k1_xmm_xmmm128_imm8 = 3883,
  EVEX_Vpcmpub_kr_k1_ymm_ymmm256_imm8 = 3884,
  EVEX_Vpcmpub_kr_k1_zmm_zmmm512_imm8 = 3885,
  EVEX_Vpcmpuw_kr_k1_xmm_xmmm128_imm8 = 3886,
  EVEX_Vpcmpuw_kr_k1_ymm_ymmm256_imm8 = 3887,
  EVEX_Vpcmpuw_kr_k1_zmm_zmmm512_imm8 = 3888,
  EVEX_Vpcmpb_kr_k1_xmm_xmmm128_imm8 = 3889,
  EVEX_Vpcmpb_kr_k1_ymm_ymmm256_imm8 = 3890,
  EVEX_Vpcmpb_kr_k1_zmm_zmmm512_imm8 = 3891,
  EVEX_Vpcmpw_kr_k1_xmm_xmmm128_imm8 = 3892,
  EVEX_Vpcmpw_kr_k1_ymm_ymmm256_imm8 = 3893,
  EVEX_Vpcmpw_kr_k1_zmm_zmmm512_imm8 = 3894,
  Dpps_xmm_xmmm128_imm8 = 3895,
  VEX_Vdpps_xmm_xmm_xmmm128_imm8 = 3896,
  VEX_Vdpps_ymm_ymm_ymmm256_imm8 = 3897,
  Dppd_xmm_xmmm128_imm8 = 3898,
  VEX_Vdppd_xmm_xmm_xmmm128_imm8 = 3899,
  Mpsadbw_xmm_xmmm128_imm8 = 3900,
  VEX_Vmpsadbw_xmm_xmm_xmmm128_imm8 = 3901,
  VEX_Vmpsadbw_ymm_ymm_ymmm256_imm8 = 3902,
  EVEX_Vdbpsadbw_xmm_k1z_xmm_xmmm128_imm8 = 3903,
  EVEX_Vdbpsadbw_ymm_k1z_ymm_ymmm256_imm8 = 3904,
  EVEX_Vdbpsadbw_zmm_k1z_zmm_zmmm512_imm8 = 3905,
  EVEX_Vshufi32x4_ymm_k1z_ymm_ymmm256b32_imm8 = 3906,
  EVEX_Vshufi32x4_zmm_k1z_zmm_zmmm512b32_imm8 = 3907,
  EVEX_Vshufi64x2_ymm_k1z_ymm_ymmm256b64_imm8 = 3908,
  EVEX_Vshufi64x2_zmm_k1z_zmm_zmmm512b64_imm8 = 3909,
  Pclmulqdq_xmm_xmmm128_imm8 = 3910,
  VEX_Vpclmulqdq_xmm_xmm_xmmm128_imm8 = 3911,
  VEX_Vpclmulqdq_ymm_ymm_ymmm256_imm8 = 3912,
  EVEX_Vpclmulqdq_xmm_xmm_xmmm128_imm8 = 3913,
  EVEX_Vpclmulqdq_ymm_ymm_ymmm256_imm8 = 3914,
  EVEX_Vpclmulqdq_zmm_zmm_zmmm512_imm8 = 3915,
  VEX_Vperm2i128_ymm_ymm_ymmm256_imm8 = 3916,
  VEX_Vpermil2ps_xmm_xmm_xmmm128_xmm_imm4 = 3917,
  VEX_Vpermil2ps_ymm_ymm_ymmm256_ymm_imm4 = 3918,
  VEX_Vpermil2ps_xmm_xmm_xmm_xmmm128_imm4 = 3919,
  VEX_Vpermil2ps_ymm_ymm_ymm_ymmm256_imm4 = 3920,
  VEX_Vpermil2pd_xmm_xmm_xmmm128_xmm_imm4 = 3921,
  VEX_Vpermil2pd_ymm_ymm_ymmm256_ymm_imm4 = 3922,
  VEX_Vpermil2pd_xmm_xmm_xmm_xmmm128_imm4 = 3923,
  VEX_Vpermil2pd_ymm_ymm_ymm_ymmm256_imm4 = 3924,
  VEX_Vblendvps_xmm_xmm_xmmm128_xmm = 3925,
  VEX_Vblendvps_ymm_ymm_ymmm256_ymm = 3926,
  VEX_Vblendvpd_xmm_xmm_xmmm128_xmm = 3927,
  VEX_Vblendvpd_ymm_ymm_ymmm256_ymm = 3928,
  VEX_Vpblendvb_xmm_xmm_xmmm128_xmm = 3929,
  VEX_Vpblendvb_ymm_ymm_ymmm256_ymm = 3930,
  EVEX_Vrangeps_xmm_k1z_xmm_xmmm128b32_imm8 = 3931,
  EVEX_Vrangeps_ymm_k1z_ymm_ymmm256b32_imm8 = 3932,
  EVEX_Vrangeps_zmm_k1z_zmm_zmmm512b32_imm8_sae = 3933,
  EVEX_Vrangepd_xmm_k1z_xmm_xmmm128b64_imm8 = 3934,
  EVEX_Vrangepd_ymm_k1z_ymm_ymmm256b64_imm8 = 3935,
  EVEX_Vrangepd_zmm_k1z_zmm_zmmm512b64_imm8_sae = 3936,
  EVEX_Vrangess_xmm_k1z_xmm_xmmm32_imm8_sae = 3937,
  EVEX_Vrangesd_xmm_k1z_xmm_xmmm64_imm8_sae = 3938,
  EVEX_Vfixupimmps_xmm_k1z_xmm_xmmm128b32_imm8 = 3939,
  EVEX_Vfixupimmps_ymm_k1z_ymm_ymmm256b32_imm8 = 3940,
  EVEX_Vfixupimmps_zmm_k1z_zmm_zmmm512b32_imm8_sae = 3941,
  EVEX_Vfixupimmpd_xmm_k1z_xmm_xmmm128b64_imm8 = 3942,
  EVEX_Vfixupimmpd_ymm_k1z_ymm_ymmm256b64_imm8 = 3943,
  EVEX_Vfixupimmpd_zmm_k1z_zmm_zmmm512b64_imm8_sae = 3944,
  EVEX_Vfixupimmss_xmm_k1z_xmm_xmmm32_imm8_sae = 3945,
  EVEX_Vfixupimmsd_xmm_k1z_xmm_xmmm64_imm8_sae = 3946,
  EVEX_Vreduceps_xmm_k1z_xmmm128b32_imm8 = 3947,
  EVEX_Vreduceps_ymm_k1z_ymmm256b32_imm8 = 3948,
  EVEX_Vreduceps_zmm_k1z_zmmm512b32_imm8_sae = 3949,
  EVEX_Vreducepd_xmm_k1z_xmmm128b64_imm8 = 3950,
  EVEX_Vreducepd_ymm_k1z_ymmm256b64_imm8 = 3951,
  EVEX_Vreducepd_zmm_k1z_zmmm512b64_imm8_sae = 3952,
  EVEX_Vreducess_xmm_k1z_xmm_xmmm32_imm8_sae = 3953,
  EVEX_Vreducesd_xmm_k1z_xmm_xmmm64_imm8_sae = 3954,
  VEX_Vfmaddsubps_xmm_xmm_xmmm128_xmm = 3955,
  VEX_Vfmaddsubps_ymm_ymm_ymmm256_ymm = 3956,
  VEX_Vfmaddsubps_xmm_xmm_xmm_xmmm128 = 3957,
  VEX_Vfmaddsubps_ymm_ymm_ymm_ymmm256 = 3958,
  VEX_Vfmaddsubpd_xmm_xmm_xmmm128_xmm = 3959,
  VEX_Vfmaddsubpd_ymm_ymm_ymmm256_ymm = 3960,
  VEX_Vfmaddsubpd_xmm_xmm_xmm_xmmm128 = 3961,
  VEX_Vfmaddsubpd_ymm_ymm_ymm_ymmm256 = 3962,
  VEX_Vfmsubaddps_xmm_xmm_xmmm128_xmm = 3963,
  VEX_Vfmsubaddps_ymm_ymm_ymmm256_ymm = 3964,
  VEX_Vfmsubaddps_xmm_xmm_xmm_xmmm128 = 3965,
  VEX_Vfmsubaddps_ymm_ymm_ymm_ymmm256 = 3966,
  VEX_Vfmsubaddpd_xmm_xmm_xmmm128_xmm = 3967,
  VEX_Vfmsubaddpd_ymm_ymm_ymmm256_ymm = 3968,
  VEX_Vfmsubaddpd_xmm_xmm_xmm_xmmm128 = 3969,
  VEX_Vfmsubaddpd_ymm_ymm_ymm_ymmm256 = 3970,
  Pcmpestrm_xmm_xmmm128_imm8 = 3971,
  Pcmpestrm64_xmm_xmmm128_imm8 = 3972,
  VEX_Vpcmpestrm_xmm_xmmm128_imm8 = 3973,
  VEX_Vpcmpestrm64_xmm_xmmm128_imm8 = 3974,
  Pcmpestri_xmm_xmmm128_imm8 = 3975,
  Pcmpestri64_xmm_xmmm128_imm8 = 3976,
  VEX_Vpcmpestri_xmm_xmmm128_imm8 = 3977,
  VEX_Vpcmpestri64_xmm_xmmm128_imm8 = 3978,
  Pcmpistrm_xmm_xmmm128_imm8 = 3979,
  VEX_Vpcmpistrm_xmm_xmmm128_imm8 = 3980,
  Pcmpistri_xmm_xmmm128_imm8 = 3981,
  VEX_Vpcmpistri_xmm_xmmm128_imm8 = 3982,
  EVEX_Vfpclassps_kr_k1_xmmm128b32_imm8 = 3983,
  EVEX_Vfpclassps_kr_k1_ymmm256b32_imm8 = 3984,
  EVEX_Vfpclassps_kr_k1_zmmm512b32_imm8 = 3985,
  EVEX_Vfpclasspd_kr_k1_xmmm128b64_imm8 = 3986,
  EVEX_Vfpclasspd_kr_k1_ymmm256b64_imm8 = 3987,
  EVEX_Vfpclasspd_kr_k1_zmmm512b64_imm8 = 3988,
  EVEX_Vfpclassss_kr_k1_xmmm32_imm8 = 3989,
  EVEX_Vfpclasssd_kr_k1_xmmm64_imm8 = 3990,
  VEX_Vfmaddps_xmm_xmm_xmmm128_xmm = 3991,
  VEX_Vfmaddps_ymm_ymm_ymmm256_ymm = 3992,
  VEX_Vfmaddps_xmm_xmm_xmm_xmmm128 = 3993,
  VEX_Vfmaddps_ymm_ymm_ymm_ymmm256 = 3994,
  VEX_Vfmaddpd_xmm_xmm_xmmm128_xmm = 3995,
  VEX_Vfmaddpd_ymm_ymm_ymmm256_ymm = 3996,
  VEX_Vfmaddpd_xmm_xmm_xmm_xmmm128 = 3997,
  VEX_Vfmaddpd_ymm_ymm_ymm_ymmm256 = 3998,
  VEX_Vfmaddss_xmm_xmm_xmmm32_xmm = 3999,
  VEX_Vfmaddss_xmm_xmm_xmm_xmmm32 = 4000,
  VEX_Vfmaddsd_xmm_xmm_xmmm64_xmm = 4001,
  VEX_Vfmaddsd_xmm_xmm_xmm_xmmm64 = 4002,
  VEX_Vfmsubps_xmm_xmm_xmmm128_xmm = 4003,
  VEX_Vfmsubps_ymm_ymm_ymmm256_ymm = 4004,
  VEX_Vfmsubps_xmm_xmm_xmm_xmmm128 = 4005,
  VEX_Vfmsubps_ymm_ymm_ymm_ymmm256 = 4006,
  VEX_Vfmsubpd_xmm_xmm_xmmm128_xmm = 4007,
  VEX_Vfmsubpd_ymm_ymm_ymmm256_ymm = 4008,
  VEX_Vfmsubpd_xmm_xmm_xmm_xmmm128 = 4009,
  VEX_Vfmsubpd_ymm_ymm_ymm_ymmm256 = 4010,
  VEX_Vfmsubss_xmm_xmm_xmmm32_xmm = 4011,
  VEX_Vfmsubss_xmm_xmm_xmm_xmmm32 = 4012,
  VEX_Vfmsubsd_xmm_xmm_xmmm64_xmm = 4013,
  VEX_Vfmsubsd_xmm_xmm_xmm_xmmm64 = 4014,
  EVEX_Vpshldw_xmm_k1z_xmm_xmmm128_imm8 = 4015,
  EVEX_Vpshldw_ymm_k1z_ymm_ymmm256_imm8 = 4016,
  EVEX_Vpshldw_zmm_k1z_zmm_zmmm512_imm8 = 4017,
  EVEX_Vpshldd_xmm_k1z_xmm_xmmm128b32_imm8 = 4018,
  EVEX_Vpshldd_ymm_k1z_ymm_ymmm256b32_imm8 = 4019,
  EVEX_Vpshldd_zmm_k1z_zmm_zmmm512b32_imm8 = 4020,
  EVEX_Vpshldq_xmm_k1z_xmm_xmmm128b64_imm8 = 4021,
  EVEX_Vpshldq_ymm_k1z_ymm_ymmm256b64_imm8 = 4022,
  EVEX_Vpshldq_zmm_k1z_zmm_zmmm512b64_imm8 = 4023,
  EVEX_Vpshrdw_xmm_k1z_xmm_xmmm128_imm8 = 4024,
  EVEX_Vpshrdw_ymm_k1z_ymm_ymmm256_imm8 = 4025,
  EVEX_Vpshrdw_zmm_k1z_zmm_zmmm512_imm8 = 4026,
  EVEX_Vpshrdd_xmm_k1z_xmm_xmmm128b32_imm8 = 4027,
  EVEX_Vpshrdd_ymm_k1z_ymm_ymmm256b32_imm8 = 4028,
  EVEX_Vpshrdd_zmm_k1z_zmm_zmmm512b32_imm8 = 4029,
  EVEX_Vpshrdq_xmm_k1z_xmm_xmmm128b64_imm8 = 4030,
  EVEX_Vpshrdq_ymm_k1z_ymm_ymmm256b64_imm8 = 4031,
  EVEX_Vpshrdq_zmm_k1z_zmm_zmmm512b64_imm8 = 4032,
  VEX_Vfnmaddps_xmm_xmm_xmmm128_xmm = 4033,
  VEX_Vfnmaddps_ymm_ymm_ymmm256_ymm = 4034,
  VEX_Vfnmaddps_xmm_xmm_xmm_xmmm128 = 4035,
  VEX_Vfnmaddps_ymm_ymm_ymm_ymmm256 = 4036,
  VEX_Vfnmaddpd_xmm_xmm_xmmm128_xmm = 4037,
  VEX_Vfnmaddpd_ymm_ymm_ymmm256_ymm = 4038,
  VEX_Vfnmaddpd_xmm_xmm_xmm_xmmm128 = 4039,
  VEX_Vfnmaddpd_ymm_ymm_ymm_ymmm256 = 4040,
  VEX_Vfnmaddss_xmm_xmm_xmmm32_xmm = 4041,
  VEX_Vfnmaddss_xmm_xmm_xmm_xmmm32 = 4042,
  VEX_Vfnmaddsd_xmm_xmm_xmmm64_xmm = 4043,
  VEX_Vfnmaddsd_xmm_xmm_xmm_xmmm64 = 4044,
  VEX_Vfnmsubps_xmm_xmm_xmmm128_xmm = 4045,
  VEX_Vfnmsubps_ymm_ymm_ymmm256_ymm = 4046,
  VEX_Vfnmsubps_xmm_xmm_xmm_xmmm128 = 4047,
  VEX_Vfnmsubps_ymm_ymm_ymm_ymmm256 = 4048,
  VEX_Vfnmsubpd_xmm_xmm_xmmm128_xmm = 4049,
  VEX_Vfnmsubpd_ymm_ymm_ymmm256_ymm = 4050,
  VEX_Vfnmsubpd_xmm_xmm_xmm_xmmm128 = 4051,
  VEX_Vfnmsubpd_ymm_ymm_ymm_ymmm256 = 4052,
  VEX_Vfnmsubss_xmm_xmm_xmmm32_xmm = 4053,
  VEX_Vfnmsubss_xmm_xmm_xmm_xmmm32 = 4054,
  VEX_Vfnmsubsd_xmm_xmm_xmmm64_xmm = 4055,
  VEX_Vfnmsubsd_xmm_xmm_xmm_xmmm64 = 4056,
  Sha1rnds4_xmm_xmmm128_imm8 = 4057,
  Gf2p8affineqb_xmm_xmmm128_imm8 = 4058,
  VEX_Vgf2p8affineqb_xmm_xmm_xmmm128_imm8 = 4059,
  VEX_Vgf2p8affineqb_ymm_ymm_ymmm256_imm8 = 4060,
  EVEX_Vgf2p8affineqb_xmm_k1z_xmm_xmmm128b64_imm8 = 4061,
  EVEX_Vgf2p8affineqb_ymm_k1z_ymm_ymmm256b64_imm8 = 4062,
  EVEX_Vgf2p8affineqb_zmm_k1z_zmm_zmmm512b64_imm8 = 4063,
  Gf2p8affineinvqb_xmm_xmmm128_imm8 = 4064,
  VEX_Vgf2p8affineinvqb_xmm_xmm_xmmm128_imm8 = 4065,
  VEX_Vgf2p8affineinvqb_ymm_ymm_ymmm256_imm8 = 4066,
  EVEX_Vgf2p8affineinvqb_xmm_k1z_xmm_xmmm128b64_imm8 = 4067,
  EVEX_Vgf2p8affineinvqb_ymm_k1z_ymm_ymmm256b64_imm8 = 4068,
  EVEX_Vgf2p8affineinvqb_zmm_k1z_zmm_zmmm512b64_imm8 = 4069,
  Aeskeygenassist_xmm_xmmm128_imm8 = 4070,
  VEX_Vaeskeygenassist_xmm_xmmm128_imm8 = 4071,
  VEX_Rorx_r32_rm32_imm8 = 4072,
  VEX_Rorx_r64_rm64_imm8 = 4073,
  XOP_Vpmacssww_xmm_xmm_xmmm128_xmm = 4074,
  XOP_Vpmacsswd_xmm_xmm_xmmm128_xmm = 4075,
  XOP_Vpmacssdql_xmm_xmm_xmmm128_xmm = 4076,
  XOP_Vpmacssdd_xmm_xmm_xmmm128_xmm = 4077,
  XOP_Vpmacssdqh_xmm_xmm_xmmm128_xmm = 4078,
  XOP_Vpmacsww_xmm_xmm_xmmm128_xmm = 4079,
  XOP_Vpmacswd_xmm_xmm_xmmm128_xmm = 4080,
  XOP_Vpmacsdql_xmm_xmm_xmmm128_xmm = 4081,
  XOP_Vpmacsdd_xmm_xmm_xmmm128_xmm = 4082,
  XOP_Vpmacsdqh_xmm_xmm_xmmm128_xmm = 4083,
  XOP_Vpcmov_xmm_xmm_xmmm128_xmm = 4084,
  XOP_Vpcmov_ymm_ymm_ymmm256_ymm = 4085,
  XOP_Vpcmov_xmm_xmm_xmm_xmmm128 = 4086,
  XOP_Vpcmov_ymm_ymm_ymm_ymmm256 = 4087,
  XOP_Vpperm_xmm_xmm_xmmm128_xmm = 4088,
  XOP_Vpperm_xmm_xmm_xmm_xmmm128 = 4089,
  XOP_Vpmadcsswd_xmm_xmm_xmmm128_xmm = 4090,
  XOP_Vpmadcswd_xmm_xmm_xmmm128_xmm = 4091,
  XOP_Vprotb_xmm_xmmm128_imm8 = 4092,
  XOP_Vprotw_xmm_xmmm128_imm8 = 4093,
  XOP_Vprotd_xmm_xmmm128_imm8 = 4094,
  XOP_Vprotq_xmm_xmmm128_imm8 = 4095,
  XOP_Vpcomb_xmm_xmm_xmmm128_imm8 = 4096,
  XOP_Vpcomw_xmm_xmm_xmmm128_imm8 = 4097,
  XOP_Vpcomd_xmm_xmm_xmmm128_imm8 = 4098,
  XOP_Vpcomq_xmm_xmm_xmmm128_imm8 = 4099,
  XOP_Vpcomub_xmm_xmm_xmmm128_imm8 = 4100,
  XOP_Vpcomuw_xmm_xmm_xmmm128_imm8 = 4101,
  XOP_Vpcomud_xmm_xmm_xmmm128_imm8 = 4102,
  XOP_Vpcomuq_xmm_xmm_xmmm128_imm8 = 4103,
  XOP_Blcfill_r32_rm32 = 4104,
  XOP_Blcfill_r64_rm64 = 4105,
  XOP_Blsfill_r32_rm32 = 4106,
  XOP_Blsfill_r64_rm64 = 4107,
  XOP_Blcs_r32_rm32 = 4108,
  XOP_Blcs_r64_rm64 = 4109,
  XOP_Tzmsk_r32_rm32 = 4110,
  XOP_Tzmsk_r64_rm64 = 4111,
  XOP_Blcic_r32_rm32 = 4112,
  XOP_Blcic_r64_rm64 = 4113,
  XOP_Blsic_r32_rm32 = 4114,
  XOP_Blsic_r64_rm64 = 4115,
  XOP_T1mskc_r32_rm32 = 4116,
  XOP_T1mskc_r64_rm64 = 4117,
  XOP_Blcmsk_r32_rm32 = 4118,
  XOP_Blcmsk_r64_rm64 = 4119,
  XOP_Blci_r32_rm32 = 4120,
  XOP_Blci_r64_rm64 = 4121,
  XOP_Llwpcb_r32 = 4122,
  XOP_Llwpcb_r64 = 4123,
  XOP_Slwpcb_r32 = 4124,
  XOP_Slwpcb_r64 = 4125,
  XOP_Vfrczps_xmm_xmmm128 = 4126,
  XOP_Vfrczps_ymm_ymmm256 = 4127,
  XOP_Vfrczpd_xmm_xmmm128 = 4128,
  XOP_Vfrczpd_ymm_ymmm256 = 4129,
  XOP_Vfrczss_xmm_xmmm32 = 4130,
  XOP_Vfrczsd_xmm_xmmm64 = 4131,
  XOP_Vprotb_xmm_xmmm128_xmm = 4132,
  XOP_Vprotb_xmm_xmm_xmmm128 = 4133,
  XOP_Vprotw_xmm_xmmm128_xmm = 4134,
  XOP_Vprotw_xmm_xmm_xmmm128 = 4135,
  XOP_Vprotd_xmm_xmmm128_xmm = 4136,
  XOP_Vprotd_xmm_xmm_xmmm128 = 4137,
  XOP_Vprotq_xmm_xmmm128_xmm = 4138,
  XOP_Vprotq_xmm_xmm_xmmm128 = 4139,
  XOP_Vpshlb_xmm_xmmm128_xmm = 4140,
  XOP_Vpshlb_xmm_xmm_xmmm128 = 4141,
  XOP_Vpshlw_xmm_xmmm128_xmm = 4142,
  XOP_Vpshlw_xmm_xmm_xmmm128 = 4143,
  XOP_Vpshld_xmm_xmmm128_xmm = 4144,
  XOP_Vpshld_xmm_xmm_xmmm128 = 4145,
  XOP_Vpshlq_xmm_xmmm128_xmm = 4146,
  XOP_Vpshlq_xmm_xmm_xmmm128 = 4147,
  XOP_Vpshab_xmm_xmmm128_xmm = 4148,
  XOP_Vpshab_xmm_xmm_xmmm128 = 4149,
  XOP_Vpshaw_xmm_xmmm128_xmm = 4150,
  XOP_Vpshaw_xmm_xmm_xmmm128 = 4151,
  XOP_Vpshad_xmm_xmmm128_xmm = 4152,
  XOP_Vpshad_xmm_xmm_xmmm128 = 4153,
  XOP_Vpshaq_xmm_xmmm128_xmm = 4154,
  XOP_Vpshaq_xmm_xmm_xmmm128 = 4155,
  XOP_Vphaddbw_xmm_xmmm128 = 4156,
  XOP_Vphaddbd_xmm_xmmm128 = 4157,
  XOP_Vphaddbq_xmm_xmmm128 = 4158,
  XOP_Vphaddwd_xmm_xmmm128 = 4159,
  XOP_Vphaddwq_xmm_xmmm128 = 4160,
  XOP_Vphadddq_xmm_xmmm128 = 4161,
  XOP_Vphaddubw_xmm_xmmm128 = 4162,
  XOP_Vphaddubd_xmm_xmmm128 = 4163,
  XOP_Vphaddubq_xmm_xmmm128 = 4164,
  XOP_Vphadduwd_xmm_xmmm128 = 4165,
  XOP_Vphadduwq_xmm_xmmm128 = 4166,
  XOP_Vphaddudq_xmm_xmmm128 = 4167,
  XOP_Vphsubbw_xmm_xmmm128 = 4168,
  XOP_Vphsubwd_xmm_xmmm128 = 4169,
  XOP_Vphsubdq_xmm_xmmm128 = 4170,
  XOP_Bextr_r32_rm32_imm32 = 4171,
  XOP_Bextr_r64_rm64_imm32 = 4172,
  XOP_Lwpins_r32_rm32_imm32 = 4173,
  XOP_Lwpins_r64_rm32_imm32 = 4174,
  XOP_Lwpval_r32_rm32_imm32 = 4175,
  XOP_Lwpval_r64_rm32_imm32 = 4176,
  D3NOW_Pi2fw_mm_mmm64 = 4177,
  D3NOW_Pi2fd_mm_mmm64 = 4178,
  D3NOW_Pf2iw_mm_mmm64 = 4179,
  D3NOW_Pf2id_mm_mmm64 = 4180,
  D3NOW_Pfrcpv_mm_mmm64 = 4181,
  D3NOW_Pfrsqrtv_mm_mmm64 = 4182,
  D3NOW_Pfnacc_mm_mmm64 = 4183,
  D3NOW_Pfpnacc_mm_mmm64 = 4184,
  D3NOW_Pfcmpge_mm_mmm64 = 4185,
  D3NOW_Pfmin_mm_mmm64 = 4186,
  D3NOW_Pfrcp_mm_mmm64 = 4187,
  D3NOW_Pfrsqrt_mm_mmm64 = 4188,
  D3NOW_Pfsub_mm_mmm64 = 4189,
  D3NOW_Pfadd_mm_mmm64 = 4190,
  D3NOW_Pfcmpgt_mm_mmm64 = 4191,
  D3NOW_Pfmax_mm_mmm64 = 4192,
  D3NOW_Pfrcpit1_mm_mmm64 = 4193,
  D3NOW_Pfrsqit1_mm_mmm64 = 4194,
  D3NOW_Pfsubr_mm_mmm64 = 4195,
  D3NOW_Pfacc_mm_mmm64 = 4196,
  D3NOW_Pfcmpeq_mm_mmm64 = 4197,
  D3NOW_Pfmul_mm_mmm64 = 4198,
  D3NOW_Pfrcpit2_mm_mmm64 = 4199,
  D3NOW_Pmulhrw_mm_mmm64 = 4200,
  D3NOW_Pswapd_mm_mmm64 = 4201,
  D3NOW_Pavgusb_mm_mmm64 = 4202,
  Rmpadjust = 4203,
  Rmpupdate = 4204,
  Psmash = 4205,
  Pvalidatew = 4206,
  Pvalidated = 4207,
  Pvalidateq = 4208,
  Serialize = 4209,
  Xsusldtrk = 4210,
  Xresldtrk = 4211,
  Invlpgbw = 4212,
  Invlpgbd = 4213,
  Invlpgbq = 4214,
  Tlbsync = 4215,
  Prefetchreserved3_m8 = 4216,
  Prefetchreserved4_m8 = 4217,
  Prefetchreserved5_m8 = 4218,
  Prefetchreserved6_m8 = 4219,
  Prefetchreserved7_m8 = 4220,
  Ud0 = 4221,
  Vmgexit = 4222,
  Getsecq = 4223,
  VEX_Ldtilecfg_m512 = 4224,
  VEX_Tilerelease = 4225,
  VEX_Sttilecfg_m512 = 4226,
  VEX_Tilezero_tmm = 4227,
  VEX_Tileloaddt1_tmm_sibmem = 4228,
  VEX_Tilestored_sibmem_tmm = 4229,
  VEX_Tileloadd_tmm_sibmem = 4230,
  VEX_Tdpbf16ps_tmm_tmm_tmm = 4231,
  VEX_Tdpbuud_tmm_tmm_tmm = 4232,
  VEX_Tdpbusd_tmm_tmm_tmm = 4233,
  VEX_Tdpbsud_tmm_tmm_tmm = 4234,
  VEX_Tdpbssd_tmm_tmm_tmm = 4235,
  Fnstdw_AX = 4236,
  Fnstsg_AX = 4237,
  Rdshr_rm32 = 4238,
  Wrshr_rm32 = 4239,
  Smint = 4240,
  Dmint = 4241,
  Rdm = 4242,
  Svdc_m80_Sreg = 4243,
  Rsdc_Sreg_m80 = 4244,
  Svldt_m80 = 4245,
  Rsldt_m80 = 4246,
  Svts_m80 = 4247,
  Rsts_m80 = 4248,
  Smint_0F7E = 4249,
  Bb0_reset = 4250,
  Bb1_reset = 4251,
  Cpu_write = 4252,
  Cpu_read = 4253,
  Altinst = 4254,
  Paveb_mm_mmm64 = 4255,
  Paddsiw_mm_mmm64 = 4256,
  Pmagw_mm_mmm64 = 4257,
  Pdistib_mm_m64 = 4258,
  Psubsiw_mm_mmm64 = 4259,
  Pmvzb_mm_m64 = 4260,
  Pmulhrw_mm_mmm64 = 4261,
  Pmvnzb_mm_m64 = 4262,
  Pmvlzb_mm_m64 = 4263,
  Pmvgezb_mm_m64 = 4264,
  Pmulhriw_mm_mmm64 = 4265,
  Pmachriw_mm_m64 = 4266,
  Cyrix_D9D7 = 4267,
  Cyrix_D9E2 = 4268,
  Ftstp = 4269,
  Cyrix_D9E7 = 4270,
  Frint2 = 4271,
  Frichop = 4272,
  Cyrix_DED8 = 4273,
  Cyrix_DEDA = 4274,
  Cyrix_DEDC = 4275,
  Cyrix_DEDD = 4276,
  Cyrix_DEDE = 4277,
  Frinear = 4278,
  Tdcall = 4279,
  Seamret = 4280,
  Seamops = 4281,
  Seamcall = 4282,
  Aesencwide128kl_m384 = 4283,
  Aesdecwide128kl_m384 = 4284,
  Aesencwide256kl_m512 = 4285,
  Aesdecwide256kl_m512 = 4286,
  Loadiwkey_xmm_xmm = 4287,
  Aesenc128kl_xmm_m384 = 4288,
  Aesdec128kl_xmm_m384 = 4289,
  Aesenc256kl_xmm_m512 = 4290,
  Aesdec256kl_xmm_m512 = 4291,
  Encodekey128_r32_r32 = 4292,
  Encodekey256_r32_r32 = 4293,
  VEX_Vbroadcastss_xmm_xmm = 4294,
  VEX_Vbroadcastss_ymm_xmm = 4295,
  VEX_Vbroadcastsd_ymm_xmm = 4296,
  Vmgexit_F2 = 4297,
  Uiret = 4298,
  Testui = 4299,
  Clui = 4300,
  Stui = 4301,
  Senduipi_r64 = 4302,
  Hreset_imm8 = 4303,
  VEX_Vpdpbusd_xmm_xmm_xmmm128 = 4304,
  VEX_Vpdpbusd_ymm_ymm_ymmm256 = 4305,
  VEX_Vpdpbusds_xmm_xmm_xmmm128 = 4306,
  VEX_Vpdpbusds_ymm_ymm_ymmm256 = 4307,
  VEX_Vpdpwssd_xmm_xmm_xmmm128 = 4308,
  VEX_Vpdpwssd_ymm_ymm_ymmm256 = 4309,
  VEX_Vpdpwssds_xmm_xmm_xmmm128 = 4310,
  VEX_Vpdpwssds_ymm_ymm_ymmm256 = 4311,
  Ccs_hash_16 = 4312,
  Ccs_hash_32 = 4313,
  Ccs_hash_64 = 4314,
  Ccs_encrypt_16 = 4315,
  Ccs_encrypt_32 = 4316,
  Ccs_encrypt_64 = 4317,
  Lkgs_rm16 = 4318,
  Lkgs_r32m16 = 4319,
  Lkgs_r64m16 = 4320,
  Eretu = 4321,
  Erets = 4322,
  EVEX_Vaddph_xmm_k1z_xmm_xmmm128b16 = 4323,
  EVEX_Vaddph_ymm_k1z_ymm_ymmm256b16 = 4324,
  EVEX_Vaddph_zmm_k1z_zmm_zmmm512b16_er = 4325,
  EVEX_Vaddsh_xmm_k1z_xmm_xmmm16_er = 4326,
  EVEX_Vcmpph_kr_k1_xmm_xmmm128b16_imm8 = 4327,
  EVEX_Vcmpph_kr_k1_ymm_ymmm256b16_imm8 = 4328,
  EVEX_Vcmpph_kr_k1_zmm_zmmm512b16_imm8_sae = 4329,
  EVEX_Vcmpsh_kr_k1_xmm_xmmm16_imm8_sae = 4330,
  EVEX_Vcomish_xmm_xmmm16_sae = 4331,
  EVEX_Vcvtdq2ph_xmm_k1z_xmmm128b32 = 4332,
  EVEX_Vcvtdq2ph_xmm_k1z_ymmm256b32 = 4333,
  EVEX_Vcvtdq2ph_ymm_k1z_zmmm512b32_er = 4334,
  EVEX_Vcvtpd2ph_xmm_k1z_xmmm128b64 = 4335,
  EVEX_Vcvtpd2ph_xmm_k1z_ymmm256b64 = 4336,
  EVEX_Vcvtpd2ph_xmm_k1z_zmmm512b64_er = 4337,
  EVEX_Vcvtph2dq_xmm_k1z_xmmm64b16 = 4338,
  EVEX_Vcvtph2dq_ymm_k1z_xmmm128b16 = 4339,
  EVEX_Vcvtph2dq_zmm_k1z_ymmm256b16_er = 4340,
  EVEX_Vcvtph2pd_xmm_k1z_xmmm32b16 = 4341,
  EVEX_Vcvtph2pd_ymm_k1z_xmmm64b16 = 4342,
  EVEX_Vcvtph2pd_zmm_k1z_xmmm128b16_sae = 4343,
  EVEX_Vcvtph2psx_xmm_k1z_xmmm64b16 = 4344,
  EVEX_Vcvtph2psx_ymm_k1z_xmmm128b16 = 4345,
  EVEX_Vcvtph2psx_zmm_k1z_ymmm256b16_sae = 4346,
  EVEX_Vcvtph2qq_xmm_k1z_xmmm32b16 = 4347,
  EVEX_Vcvtph2qq_ymm_k1z_xmmm64b16 = 4348,
  EVEX_Vcvtph2qq_zmm_k1z_xmmm128b16_er = 4349,
  EVEX_Vcvtph2udq_xmm_k1z_xmmm64b16 = 4350,
  EVEX_Vcvtph2udq_ymm_k1z_xmmm128b16 = 4351,
  EVEX_Vcvtph2udq_zmm_k1z_ymmm256b16_er = 4352,
  EVEX_Vcvtph2uqq_xmm_k1z_xmmm32b16 = 4353,
  EVEX_Vcvtph2uqq_ymm_k1z_xmmm64b16 = 4354,
  EVEX_Vcvtph2uqq_zmm_k1z_xmmm128b16_er = 4355,
  EVEX_Vcvtph2uw_xmm_k1z_xmmm128b16 = 4356,
  EVEX_Vcvtph2uw_ymm_k1z_ymmm256b16 = 4357,
  EVEX_Vcvtph2uw_zmm_k1z_zmmm512b16_er = 4358,
  EVEX_Vcvtph2w_xmm_k1z_xmmm128b16 = 4359,
  EVEX_Vcvtph2w_ymm_k1z_ymmm256b16 = 4360,
  EVEX_Vcvtph2w_zmm_k1z_zmmm512b16_er = 4361,
  EVEX_Vcvtps2phx_xmm_k1z_xmmm128b32 = 4362,
  EVEX_Vcvtps2phx_xmm_k1z_ymmm256b32 = 4363,
  EVEX_Vcvtps2phx_ymm_k1z_zmmm512b32_er = 4364,
  EVEX_Vcvtqq2ph_xmm_k1z_xmmm128b64 = 4365,
  EVEX_Vcvtqq2ph_xmm_k1z_ymmm256b64 = 4366,
  EVEX_Vcvtqq2ph_xmm_k1z_zmmm512b64_er = 4367,
  EVEX_Vcvtsd2sh_xmm_k1z_xmm_xmmm64_er = 4368,
  EVEX_Vcvtsh2sd_xmm_k1z_xmm_xmmm16_sae = 4369,
  EVEX_Vcvtsh2si_r32_xmmm16_er = 4370,
  EVEX_Vcvtsh2si_r64_xmmm16_er = 4371,
  EVEX_Vcvtsh2ss_xmm_k1z_xmm_xmmm16_sae = 4372,
  EVEX_Vcvtsh2usi_r32_xmmm16_er = 4373,
  EVEX_Vcvtsh2usi_r64_xmmm16_er = 4374,
  EVEX_Vcvtsi2sh_xmm_xmm_rm32_er = 4375,
  EVEX_Vcvtsi2sh_xmm_xmm_rm64_er = 4376,
  EVEX_Vcvtss2sh_xmm_k1z_xmm_xmmm32_er = 4377,
  EVEX_Vcvttph2dq_xmm_k1z_xmmm64b16 = 4378,
  EVEX_Vcvttph2dq_ymm_k1z_xmmm128b16 = 4379,
  EVEX_Vcvttph2dq_zmm_k1z_ymmm256b16_sae = 4380,
  EVEX_Vcvttph2qq_xmm_k1z_xmmm32b16 = 4381,
  EVEX_Vcvttph2qq_ymm_k1z_xmmm64b16 = 4382,
  EVEX_Vcvttph2qq_zmm_k1z_xmmm128b16_sae = 4383,
  EVEX_Vcvttph2udq_xmm_k1z_xmmm64b16 = 4384,
  EVEX_Vcvttph2udq_ymm_k1z_xmmm128b16 = 4385,
  EVEX_Vcvttph2udq_zmm_k1z_ymmm256b16_sae = 4386,
  EVEX_Vcvttph2uqq_xmm_k1z_xmmm32b16 = 4387,
  EVEX_Vcvttph2uqq_ymm_k1z_xmmm64b16 = 4388,
  EVEX_Vcvttph2uqq_zmm_k1z_xmmm128b16_sae = 4389,
  EVEX_Vcvttph2uw_xmm_k1z_xmmm128b16 = 4390,
  EVEX_Vcvttph2uw_ymm_k1z_ymmm256b16 = 4391,
  EVEX_Vcvttph2uw_zmm_k1z_zmmm512b16_sae = 4392,
  EVEX_Vcvttph2w_xmm_k1z_xmmm128b16 = 4393,
  EVEX_Vcvttph2w_ymm_k1z_ymmm256b16 = 4394,
  EVEX_Vcvttph2w_zmm_k1z_zmmm512b16_sae = 4395,
  EVEX_Vcvttsh2si_r32_xmmm16_sae = 4396,
  EVEX_Vcvttsh2si_r64_xmmm16_sae = 4397,
  EVEX_Vcvttsh2usi_r32_xmmm16_sae = 4398,
  EVEX_Vcvttsh2usi_r64_xmmm16_sae = 4399,
  EVEX_Vcvtudq2ph_xmm_k1z_xmmm128b32 = 4400,
  EVEX_Vcvtudq2ph_xmm_k1z_ymmm256b32 = 4401,
  EVEX_Vcvtudq2ph_ymm_k1z_zmmm512b32_er = 4402,
  EVEX_Vcvtuqq2ph_xmm_k1z_xmmm128b64 = 4403,
  EVEX_Vcvtuqq2ph_xmm_k1z_ymmm256b64 = 4404,
  EVEX_Vcvtuqq2ph_xmm_k1z_zmmm512b64_er = 4405,
  EVEX_Vcvtusi2sh_xmm_xmm_rm32_er = 4406,
  EVEX_Vcvtusi2sh_xmm_xmm_rm64_er = 4407,
  EVEX_Vcvtuw2ph_xmm_k1z_xmmm128b16 = 4408,
  EVEX_Vcvtuw2ph_ymm_k1z_ymmm256b16 = 4409,
  EVEX_Vcvtuw2ph_zmm_k1z_zmmm512b16_er = 4410,
  EVEX_Vcvtw2ph_xmm_k1z_xmmm128b16 = 4411,
  EVEX_Vcvtw2ph_ymm_k1z_ymmm256b16 = 4412,
  EVEX_Vcvtw2ph_zmm_k1z_zmmm512b16_er = 4413,
  EVEX_Vdivph_xmm_k1z_xmm_xmmm128b16 = 4414,
  EVEX_Vdivph_ymm_k1z_ymm_ymmm256b16 = 4415,
  EVEX_Vdivph_zmm_k1z_zmm_zmmm512b16_er = 4416,
  EVEX_Vdivsh_xmm_k1z_xmm_xmmm16_er = 4417,
  EVEX_Vfcmaddcph_xmm_k1z_xmm_xmmm128b32 = 4418,
  EVEX_Vfcmaddcph_ymm_k1z_ymm_ymmm256b32 = 4419,
  EVEX_Vfcmaddcph_zmm_k1z_zmm_zmmm512b32_er = 4420,
  EVEX_Vfmaddcph_xmm_k1z_xmm_xmmm128b32 = 4421,
  EVEX_Vfmaddcph_ymm_k1z_ymm_ymmm256b32 = 4422,
  EVEX_Vfmaddcph_zmm_k1z_zmm_zmmm512b32_er = 4423,
  EVEX_Vfcmaddcsh_xmm_k1z_xmm_xmmm32_er = 4424,
  EVEX_Vfmaddcsh_xmm_k1z_xmm_xmmm32_er = 4425,
  EVEX_Vfcmulcph_xmm_k1z_xmm_xmmm128b32 = 4426,
  EVEX_Vfcmulcph_ymm_k1z_ymm_ymmm256b32 = 4427,
  EVEX_Vfcmulcph_zmm_k1z_zmm_zmmm512b32_er = 4428,
  EVEX_Vfmulcph_xmm_k1z_xmm_xmmm128b32 = 4429,
  EVEX_Vfmulcph_ymm_k1z_ymm_ymmm256b32 = 4430,
  EVEX_Vfmulcph_zmm_k1z_zmm_zmmm512b32_er = 4431,
  EVEX_Vfcmulcsh_xmm_k1z_xmm_xmmm32_er = 4432,
  EVEX_Vfmulcsh_xmm_k1z_xmm_xmmm32_er = 4433,
  EVEX_Vfmaddsub132ph_xmm_k1z_xmm_xmmm128b16 = 4434,
  EVEX_Vfmaddsub132ph_ymm_k1z_ymm_ymmm256b16 = 4435,
  EVEX_Vfmaddsub132ph_zmm_k1z_zmm_zmmm512b16_er = 4436,
  EVEX_Vfmaddsub213ph_xmm_k1z_xmm_xmmm128b16 = 4437,
  EVEX_Vfmaddsub213ph_ymm_k1z_ymm_ymmm256b16 = 4438,
  EVEX_Vfmaddsub213ph_zmm_k1z_zmm_zmmm512b16_er = 4439,
  EVEX_Vfmaddsub231ph_xmm_k1z_xmm_xmmm128b16 = 4440,
  EVEX_Vfmaddsub231ph_ymm_k1z_ymm_ymmm256b16 = 4441,
  EVEX_Vfmaddsub231ph_zmm_k1z_zmm_zmmm512b16_er = 4442,
  EVEX_Vfmsubadd132ph_xmm_k1z_xmm_xmmm128b16 = 4443,
  EVEX_Vfmsubadd132ph_ymm_k1z_ymm_ymmm256b16 = 4444,
  EVEX_Vfmsubadd132ph_zmm_k1z_zmm_zmmm512b16_er = 4445,
  EVEX_Vfmsubadd213ph_xmm_k1z_xmm_xmmm128b16 = 4446,
  EVEX_Vfmsubadd213ph_ymm_k1z_ymm_ymmm256b16 = 4447,
  EVEX_Vfmsubadd213ph_zmm_k1z_zmm_zmmm512b16_er = 4448,
  EVEX_Vfmsubadd231ph_xmm_k1z_xmm_xmmm128b16 = 4449,
  EVEX_Vfmsubadd231ph_ymm_k1z_ymm_ymmm256b16 = 4450,
  EVEX_Vfmsubadd231ph_zmm_k1z_zmm_zmmm512b16_er = 4451,
  EVEX_Vfmadd132ph_xmm_k1z_xmm_xmmm128b16 = 4452,
  EVEX_Vfmadd132ph_ymm_k1z_ymm_ymmm256b16 = 4453,
  EVEX_Vfmadd132ph_zmm_k1z_zmm_zmmm512b16_er = 4454,
  EVEX_Vfmadd213ph_xmm_k1z_xmm_xmmm128b16 = 4455,
  EVEX_Vfmadd213ph_ymm_k1z_ymm_ymmm256b16 = 4456,
  EVEX_Vfmadd213ph_zmm_k1z_zmm_zmmm512b16_er = 4457,
  EVEX_Vfmadd231ph_xmm_k1z_xmm_xmmm128b16 = 4458,
  EVEX_Vfmadd231ph_ymm_k1z_ymm_ymmm256b16 = 4459,
  EVEX_Vfmadd231ph_zmm_k1z_zmm_zmmm512b16_er = 4460,
  EVEX_Vfnmadd132ph_xmm_k1z_xmm_xmmm128b16 = 4461,
  EVEX_Vfnmadd132ph_ymm_k1z_ymm_ymmm256b16 = 4462,
  EVEX_Vfnmadd132ph_zmm_k1z_zmm_zmmm512b16_er = 4463,
  EVEX_Vfnmadd213ph_xmm_k1z_xmm_xmmm128b16 = 4464,
  EVEX_Vfnmadd213ph_ymm_k1z_ymm_ymmm256b16 = 4465,
  EVEX_Vfnmadd213ph_zmm_k1z_zmm_zmmm512b16_er = 4466,
  EVEX_Vfnmadd231ph_xmm_k1z_xmm_xmmm128b16 = 4467,
  EVEX_Vfnmadd231ph_ymm_k1z_ymm_ymmm256b16 = 4468,
  EVEX_Vfnmadd231ph_zmm_k1z_zmm_zmmm512b16_er = 4469,
  EVEX_Vfmadd132sh_xmm_k1z_xmm_xmmm16_er = 4470,
  EVEX_Vfmadd213sh_xmm_k1z_xmm_xmmm16_er = 4471,
  EVEX_Vfmadd231sh_xmm_k1z_xmm_xmmm16_er = 4472,
  EVEX_Vfnmadd132sh_xmm_k1z_xmm_xmmm16_er = 4473,
  EVEX_Vfnmadd213sh_xmm_k1z_xmm_xmmm16_er = 4474,
  EVEX_Vfnmadd231sh_xmm_k1z_xmm_xmmm16_er = 4475,
  EVEX_Vfmsub132ph_xmm_k1z_xmm_xmmm128b16 = 4476,
  EVEX_Vfmsub132ph_ymm_k1z_ymm_ymmm256b16 = 4477,
  EVEX_Vfmsub132ph_zmm_k1z_zmm_zmmm512b16_er = 4478,
  EVEX_Vfmsub213ph_xmm_k1z_xmm_xmmm128b16 = 4479,
  EVEX_Vfmsub213ph_ymm_k1z_ymm_ymmm256b16 = 4480,
  EVEX_Vfmsub213ph_zmm_k1z_zmm_zmmm512b16_er = 4481,
  EVEX_Vfmsub231ph_xmm_k1z_xmm_xmmm128b16 = 4482,
  EVEX_Vfmsub231ph_ymm_k1z_ymm_ymmm256b16 = 4483,
  EVEX_Vfmsub231ph_zmm_k1z_zmm_zmmm512b16_er = 4484,
  EVEX_Vfnmsub132ph_xmm_k1z_xmm_xmmm128b16 = 4485,
  EVEX_Vfnmsub132ph_ymm_k1z_ymm_ymmm256b16 = 4486,
  EVEX_Vfnmsub132ph_zmm_k1z_zmm_zmmm512b16_er = 4487,
  EVEX_Vfnmsub213ph_xmm_k1z_xmm_xmmm128b16 = 4488,
  EVEX_Vfnmsub213ph_ymm_k1z_ymm_ymmm256b16 = 4489,
  EVEX_Vfnmsub213ph_zmm_k1z_zmm_zmmm512b16_er = 4490,
  EVEX_Vfnmsub231ph_xmm_k1z_xmm_xmmm128b16 = 4491,
  EVEX_Vfnmsub231ph_ymm_k1z_ymm_ymmm256b16 = 4492,
  EVEX_Vfnmsub231ph_zmm_k1z_zmm_zmmm512b16_er = 4493,
  EVEX_Vfmsub132sh_xmm_k1z_xmm_xmmm16_er = 4494,
  EVEX_Vfmsub213sh_xmm_k1z_xmm_xmmm16_er = 4495,
  EVEX_Vfmsub231sh_xmm_k1z_xmm_xmmm16_er = 4496,
  EVEX_Vfnmsub132sh_xmm_k1z_xmm_xmmm16_er = 4497,
  EVEX_Vfnmsub213sh_xmm_k1z_xmm_xmmm16_er = 4498,
  EVEX_Vfnmsub231sh_xmm_k1z_xmm_xmmm16_er = 4499,
  EVEX_Vfpclassph_kr_k1_xmmm128b16_imm8 = 4500,
  EVEX_Vfpclassph_kr_k1_ymmm256b16_imm8 = 4501,
  EVEX_Vfpclassph_kr_k1_zmmm512b16_imm8 = 4502,
  EVEX_Vfpclasssh_kr_k1_xmmm16_imm8 = 4503,
  EVEX_Vgetexpph_xmm_k1z_xmmm128b16 = 4504,
  EVEX_Vgetexpph_ymm_k1z_ymmm256b16 = 4505,
  EVEX_Vgetexpph_zmm_k1z_zmmm512b16_sae = 4506,
  EVEX_Vgetexpsh_xmm_k1z_xmm_xmmm16_sae = 4507,
  EVEX_Vgetmantph_xmm_k1z_xmmm128b16_imm8 = 4508,
  EVEX_Vgetmantph_ymm_k1z_ymmm256b16_imm8 = 4509,
  EVEX_Vgetmantph_zmm_k1z_zmmm512b16_imm8_sae = 4510,
  EVEX_Vgetmantsh_xmm_k1z_xmm_xmmm16_imm8_sae = 4511,
  EVEX_Vmaxph_xmm_k1z_xmm_xmmm128b16 = 4512,
  EVEX_Vmaxph_ymm_k1z_ymm_ymmm256b16 = 4513,
  EVEX_Vmaxph_zmm_k1z_zmm_zmmm512b16_sae = 4514,
  EVEX_Vmaxsh_xmm_k1z_xmm_xmmm16_sae = 4515,
  EVEX_Vminph_xmm_k1z_xmm_xmmm128b16 = 4516,
  EVEX_Vminph_ymm_k1z_ymm_ymmm256b16 = 4517,
  EVEX_Vminph_zmm_k1z_zmm_zmmm512b16_sae = 4518,
  EVEX_Vminsh_xmm_k1z_xmm_xmmm16_sae = 4519,
  EVEX_Vmovsh_xmm_k1z_m16 = 4520,
  EVEX_Vmovsh_m16_k1_xmm = 4521,
  EVEX_Vmovsh_xmm_k1z_xmm_xmm = 4522,
  EVEX_Vmovsh_xmm_k1z_xmm_xmm_MAP5_11 = 4523,
  EVEX_Vmovw_xmm_r32m16 = 4524,
  EVEX_Vmovw_xmm_r64m16 = 4525,
  EVEX_Vmovw_r32m16_xmm = 4526,
  EVEX_Vmovw_r64m16_xmm = 4527,
  EVEX_Vmulph_xmm_k1z_xmm_xmmm128b16 = 4528,
  EVEX_Vmulph_ymm_k1z_ymm_ymmm256b16 = 4529,
  EVEX_Vmulph_zmm_k1z_zmm_zmmm512b16_er = 4530,
  EVEX_Vmulsh_xmm_k1z_xmm_xmmm16_er = 4531,
  EVEX_Vrcpph_xmm_k1z_xmmm128b16 = 4532,
  EVEX_Vrcpph_ymm_k1z_ymmm256b16 = 4533,
  EVEX_Vrcpph_zmm_k1z_zmmm512b16 = 4534,
  EVEX_Vrcpsh_xmm_k1z_xmm_xmmm16 = 4535,
  EVEX_Vreduceph_xmm_k1z_xmmm128b16_imm8 = 4536,
  EVEX_Vreduceph_ymm_k1z_ymmm256b16_imm8 = 4537,
  EVEX_Vreduceph_zmm_k1z_zmmm512b16_imm8_sae = 4538,
  EVEX_Vreducesh_xmm_k1z_xmm_xmmm16_imm8_sae = 4539,
  EVEX_Vrndscaleph_xmm_k1z_xmmm128b16_imm8 = 4540,
  EVEX_Vrndscaleph_ymm_k1z_ymmm256b16_imm8 = 4541,
  EVEX_Vrndscaleph_zmm_k1z_zmmm512b16_imm8_sae = 4542,
  EVEX_Vrndscalesh_xmm_k1z_xmm_xmmm16_imm8_sae = 4543,
  EVEX_Vrsqrtph_xmm_k1z_xmmm128b16 = 4544,
  EVEX_Vrsqrtph_ymm_k1z_ymmm256b16 = 4545,
  EVEX_Vrsqrtph_zmm_k1z_zmmm512b16 = 4546,
  EVEX_Vrsqrtsh_xmm_k1z_xmm_xmmm16 = 4547,
  EVEX_Vscalefph_xmm_k1z_xmm_xmmm128b16 = 4548,
  EVEX_Vscalefph_ymm_k1z_ymm_ymmm256b16 = 4549,
  EVEX_Vscalefph_zmm_k1z_zmm_zmmm512b16_er = 4550,
  EVEX_Vscalefsh_xmm_k1z_xmm_xmmm16_er = 4551,
  EVEX_Vsqrtph_xmm_k1z_xmmm128b16 = 4552,
  EVEX_Vsqrtph_ymm_k1z_ymmm256b16 = 4553,
  EVEX_Vsqrtph_zmm_k1z_zmmm512b16_er = 4554,
  EVEX_Vsqrtsh_xmm_k1z_xmm_xmmm16_er = 4555,
  EVEX_Vsubph_xmm_k1z_xmm_xmmm128b16 = 4556,
  EVEX_Vsubph_ymm_k1z_ymm_ymmm256b16 = 4557,
  EVEX_Vsubph_zmm_k1z_zmm_zmmm512b16_er = 4558,
  EVEX_Vsubsh_xmm_k1z_xmm_xmmm16_er = 4559,
  EVEX_Vucomish_xmm_xmmm16_sae = 4560,
  Rdudbg = 4561,
  Wrudbg = 4562,
  VEX_KNC_Jkzd_kr_rel8_64 = 4563,
  VEX_KNC_Jknzd_kr_rel8_64 = 4564,
  VEX_KNC_Vprefetchnta_m8 = 4565,
  VEX_KNC_Vprefetch0_m8 = 4566,
  VEX_KNC_Vprefetch1_m8 = 4567,
  VEX_KNC_Vprefetch2_m8 = 4568,
  VEX_KNC_Vprefetchenta_m8 = 4569,
  VEX_KNC_Vprefetche0_m8 = 4570,
  VEX_KNC_Vprefetche1_m8 = 4571,
  VEX_KNC_Vprefetche2_m8 = 4572,
  VEX_KNC_Kand_kr_kr = 4573,
  VEX_KNC_Kandn_kr_kr = 4574,
  VEX_KNC_Kandnr_kr_kr = 4575,
  VEX_KNC_Knot_kr_kr = 4576,
  VEX_KNC_Kor_kr_kr = 4577,
  VEX_KNC_Kxnor_kr_kr = 4578,
  VEX_KNC_Kxor_kr_kr = 4579,
  VEX_KNC_Kmerge2l1h_kr_kr = 4580,
  VEX_KNC_Kmerge2l1l_kr_kr = 4581,
  VEX_KNC_Jkzd_kr_rel32_64 = 4582,
  VEX_KNC_Jknzd_kr_rel32_64 = 4583,
  VEX_KNC_Kmov_kr_kr = 4584,
  VEX_KNC_Kmov_kr_r32 = 4585,
  VEX_KNC_Kmov_r32_kr = 4586,
  VEX_KNC_Kconcath_r64_kr_kr = 4587,
  VEX_KNC_Kconcatl_r64_kr_kr = 4588,
  VEX_KNC_Kortest_kr_kr = 4589,
  VEX_KNC_Delay_r32 = 4590,
  VEX_KNC_Delay_r64 = 4591,
  VEX_KNC_Spflt_r32 = 4592,
  VEX_KNC_Spflt_r64 = 4593,
  VEX_KNC_Clevict1_m8 = 4594,
  VEX_KNC_Clevict0_m8 = 4595,
  VEX_KNC_Popcnt_r32_r32 = 4596,
  VEX_KNC_Popcnt_r64_r64 = 4597,
  VEX_KNC_Tzcnt_r32_r32 = 4598,
  VEX_KNC_Tzcnt_r64_r64 = 4599,
  VEX_KNC_Tzcnti_r32_r32 = 4600,
  VEX_KNC_Tzcnti_r64_r64 = 4601,
  VEX_KNC_Lzcnt_r32_r32 = 4602,
  VEX_KNC_Lzcnt_r64_r64 = 4603,
  VEX_KNC_Undoc_r32_rm32_128_F3_0F38_W0_F0 = 4604,
  VEX_KNC_Undoc_r64_rm64_128_F3_0F38_W1_F0 = 4605,
  VEX_KNC_Undoc_r32_rm32_128_F2_0F38_W0_F0 = 4606,
  VEX_KNC_Undoc_r64_rm64_128_F2_0F38_W1_F0 = 4607,
  VEX_KNC_Undoc_r32_rm32_128_F2_0F38_W0_F1 = 4608,
  VEX_KNC_Undoc_r64_rm64_128_F2_0F38_W1_F1 = 4609,
  VEX_KNC_Kextract_kr_r64_imm8 = 4610,
  MVEX_Vprefetchnta_m = 4611,
  MVEX_Vprefetch0_m = 4612,
  MVEX_Vprefetch1_m = 4613,
  MVEX_Vprefetch2_m = 4614,
  MVEX_Vprefetchenta_m = 4615,
  MVEX_Vprefetche0_m = 4616,
  MVEX_Vprefetche1_m = 4617,
  MVEX_Vprefetche2_m = 4618,
  MVEX_Vmovaps_zmm_k1_zmmmt = 4619,
  MVEX_Vmovapd_zmm_k1_zmmmt = 4620,
  MVEX_Vmovaps_mt_k1_zmm = 4621,
  MVEX_Vmovapd_mt_k1_zmm = 4622,
  MVEX_Vmovnrapd_m_k1_zmm = 4623,
  MVEX_Vmovnrngoapd_m_k1_zmm = 4624,
  MVEX_Vmovnraps_m_k1_zmm = 4625,
  MVEX_Vmovnrngoaps_m_k1_zmm = 4626,
  MVEX_Vaddps_zmm_k1_zmm_zmmmt = 4627,
  MVEX_Vaddpd_zmm_k1_zmm_zmmmt = 4628,
  MVEX_Vmulps_zmm_k1_zmm_zmmmt = 4629,
  MVEX_Vmulpd_zmm_k1_zmm_zmmmt = 4630,
  MVEX_Vcvtps2pd_zmm_k1_zmmmt = 4631,
  MVEX_Vcvtpd2ps_zmm_k1_zmmmt = 4632,
  MVEX_Vsubps_zmm_k1_zmm_zmmmt = 4633,
  MVEX_Vsubpd_zmm_k1_zmm_zmmmt = 4634,
  MVEX_Vpcmpgtd_kr_k1_zmm_zmmmt = 4635,
  MVEX_Vmovdqa32_zmm_k1_zmmmt = 4636,
  MVEX_Vmovdqa64_zmm_k1_zmmmt = 4637,
  MVEX_Vpshufd_zmm_k1_zmmmt_imm8 = 4638,
  MVEX_Vpsrld_zmm_k1_zmmmt_imm8 = 4639,
  MVEX_Vpsrad_zmm_k1_zmmmt_imm8 = 4640,
  MVEX_Vpslld_zmm_k1_zmmmt_imm8 = 4641,
  MVEX_Vpcmpeqd_kr_k1_zmm_zmmmt = 4642,
  MVEX_Vcvtudq2pd_zmm_k1_zmmmt = 4643,
  MVEX_Vmovdqa32_mt_k1_zmm = 4644,
  MVEX_Vmovdqa64_mt_k1_zmm = 4645,
  MVEX_Clevict1_m = 4646,
  MVEX_Clevict0_m = 4647,
  MVEX_Vcmpps_kr_k1_zmm_zmmmt_imm8 = 4648,
  MVEX_Vcmppd_kr_k1_zmm_zmmmt_imm8 = 4649,
  MVEX_Vpandd_zmm_k1_zmm_zmmmt = 4650,
  MVEX_Vpandq_zmm_k1_zmm_zmmmt = 4651,
  MVEX_Vpandnd_zmm_k1_zmm_zmmmt = 4652,
  MVEX_Vpandnq_zmm_k1_zmm_zmmmt = 4653,
  MVEX_Vcvtdq2pd_zmm_k1_zmmmt = 4654,
  MVEX_Vpord_zmm_k1_zmm_zmmmt = 4655,
  MVEX_Vporq_zmm_k1_zmm_zmmmt = 4656,
  MVEX_Vpxord_zmm_k1_zmm_zmmmt = 4657,
  MVEX_Vpxorq_zmm_k1_zmm_zmmmt = 4658,
  MVEX_Vpsubd_zmm_k1_zmm_zmmmt = 4659,
  MVEX_Vpaddd_zmm_k1_zmm_zmmmt = 4660,
  MVEX_Vbroadcastss_zmm_k1_mt = 4661,
  MVEX_Vbroadcastsd_zmm_k1_mt = 4662,
  MVEX_Vbroadcastf32x4_zmm_k1_mt = 4663,
  MVEX_Vbroadcastf64x4_zmm_k1_mt = 4664,
  MVEX_Vptestmd_kr_k1_zmm_zmmmt = 4665,
  MVEX_Vpermd_zmm_k1_zmm_zmmmt = 4666,
  MVEX_Vpminsd_zmm_k1_zmm_zmmmt = 4667,
  MVEX_Vpminud_zmm_k1_zmm_zmmmt = 4668,
  MVEX_Vpmaxsd_zmm_k1_zmm_zmmmt = 4669,
  MVEX_Vpmaxud_zmm_k1_zmm_zmmmt = 4670,
  MVEX_Vpmulld_zmm_k1_zmm_zmmmt = 4671,
  MVEX_Vgetexpps_zmm_k1_zmmmt = 4672,
  MVEX_Vgetexppd_zmm_k1_zmmmt = 4673,
  MVEX_Vpsrlvd_zmm_k1_zmm_zmmmt = 4674,
  MVEX_Vpsravd_zmm_k1_zmm_zmmmt = 4675,
  MVEX_Vpsllvd_zmm_k1_zmm_zmmmt = 4676,
  MVEX_Undoc_zmm_k1_zmmmt_512_66_0F38_W0_48 = 4677,
  MVEX_Undoc_zmm_k1_zmmmt_512_66_0F38_W0_49 = 4678,
  MVEX_Undoc_zmm_k1_zmmmt_512_66_0F38_W0_4A = 4679,
  MVEX_Undoc_zmm_k1_zmmmt_512_66_0F38_W0_4B = 4680,
  MVEX_Vaddnps_zmm_k1_zmm_zmmmt = 4681,
  MVEX_Vaddnpd_zmm_k1_zmm_zmmmt = 4682,
  MVEX_Vgmaxabsps_zmm_k1_zmm_zmmmt = 4683,
  MVEX_Vgminps_zmm_k1_zmm_zmmmt = 4684,
  MVEX_Vgminpd_zmm_k1_zmm_zmmmt = 4685,
  MVEX_Vgmaxps_zmm_k1_zmm_zmmmt = 4686,
  MVEX_Vgmaxpd_zmm_k1_zmm_zmmmt = 4687,
  MVEX_Undoc_zmm_k1_zmm_zmmmt_512_66_0F38_W0_54 = 4688,
  MVEX_Vfixupnanps_zmm_k1_zmm_zmmmt = 4689,
  MVEX_Vfixupnanpd_zmm_k1_zmm_zmmmt = 4690,
  MVEX_Undoc_zmm_k1_zmm_zmmmt_512_66_0F38_W0_56 = 4691,
  MVEX_Undoc_zmm_k1_zmm_zmmmt_512_66_0F38_W0_57 = 4692,
  MVEX_Vpbroadcastd_zmm_k1_mt = 4693,
  MVEX_Vpbroadcastq_zmm_k1_mt = 4694,
  MVEX_Vbroadcasti32x4_zmm_k1_mt = 4695,
  MVEX_Vbroadcasti64x4_zmm_k1_mt = 4696,
  MVEX_Vpadcd_zmm_k1_kr_zmmmt = 4697,
  MVEX_Vpaddsetcd_zmm_k1_kr_zmmmt = 4698,
  MVEX_Vpsbbd_zmm_k1_kr_zmmmt = 4699,
  MVEX_Vpsubsetbd_zmm_k1_kr_zmmmt = 4700,
  MVEX_Vpblendmd_zmm_k1_zmm_zmmmt = 4701,
  MVEX_Vpblendmq_zmm_k1_zmm_zmmmt = 4702,
  MVEX_Vblendmps_zmm_k1_zmm_zmmmt = 4703,
  MVEX_Vblendmpd_zmm_k1_zmm_zmmmt = 4704,
  MVEX_Undoc_zmm_k1_zmm_zmmmt_512_66_0F38_W0_67 = 4705,
  MVEX_Undoc_zmm_k1_zmmmt_512_66_0F38_W0_68 = 4706,
  MVEX_Undoc_zmm_k1_zmmmt_512_66_0F38_W0_69 = 4707,
  MVEX_Undoc_zmm_k1_zmmmt_512_66_0F38_W0_6A = 4708,
  MVEX_Undoc_zmm_k1_zmmmt_512_66_0F38_W0_6B = 4709,
  MVEX_Vpsubrd_zmm_k1_zmm_zmmmt = 4710,
  MVEX_Vsubrps_zmm_k1_zmm_zmmmt = 4711,
  MVEX_Vsubrpd_zmm_k1_zmm_zmmmt = 4712,
  MVEX_Vpsbbrd_zmm_k1_kr_zmmmt = 4713,
  MVEX_Vpsubrsetbd_zmm_k1_kr_zmmmt = 4714,
  MVEX_Undoc_zmm_k1_zmm_zmmmt_512_66_0F38_W0_70 = 4715,
  MVEX_Undoc_zmm_k1_zmm_zmmmt_512_66_0F38_W0_71 = 4716,
  MVEX_Undoc_zmm_k1_zmm_zmmmt_512_66_0F38_W0_72 = 4717,
  MVEX_Undoc_zmm_k1_zmm_zmmmt_512_66_0F38_W0_73 = 4718,
  MVEX_Vpcmpltd_kr_k1_zmm_zmmmt = 4719,
  MVEX_Vscaleps_zmm_k1_zmm_zmmmt = 4720,
  MVEX_Vpmulhud_zmm_k1_zmm_zmmmt = 4721,
  MVEX_Vpmulhd_zmm_k1_zmm_zmmmt = 4722,
  MVEX_Vpgatherdd_zmm_k1_mvt = 4723,
  MVEX_Vpgatherdq_zmm_k1_mvt = 4724,
  MVEX_Vgatherdps_zmm_k1_mvt = 4725,
  MVEX_Vgatherdpd_zmm_k1_mvt = 4726,
  MVEX_Undoc_zmm_k1_zmm_zmmmt_512_66_0F38_W0_94 = 4727,
  MVEX_Undoc_zmm_k1_zmm_zmmmt_512_66_0F38_W1_94 = 4728,
  MVEX_Vfmadd132ps_zmm_k1_zmm_zmmmt = 4729,
  MVEX_Vfmadd132pd_zmm_k1_zmm_zmmmt = 4730,
  MVEX_Vfmsub132ps_zmm_k1_zmm_zmmmt = 4731,
  MVEX_Vfmsub132pd_zmm_k1_zmm_zmmmt = 4732,
  MVEX_Vfnmadd132ps_zmm_k1_zmm_zmmmt = 4733,
  MVEX_Vfnmadd132pd_zmm_k1_zmm_zmmmt = 4734,
  MVEX_Vfnmsub132ps_zmm_k1_zmm_zmmmt = 4735,
  MVEX_Vfnmsub132pd_zmm_k1_zmm_zmmmt = 4736,
  MVEX_Vpscatterdd_mvt_k1_zmm = 4737,
  MVEX_Vpscatterdq_mvt_k1_zmm = 4738,
  MVEX_Vscatterdps_mvt_k1_zmm = 4739,
  MVEX_Vscatterdpd_mvt_k1_zmm = 4740,
  MVEX_Vfmadd233ps_zmm_k1_zmm_zmmmt = 4741,
  MVEX_Vfmadd213ps_zmm_k1_zmm_zmmmt = 4742,
  MVEX_Vfmadd213pd_zmm_k1_zmm_zmmmt = 4743,
  MVEX_Vfmsub213ps_zmm_k1_zmm_zmmmt = 4744,
  MVEX_Vfmsub213pd_zmm_k1_zmm_zmmmt = 4745,
  MVEX_Vfnmadd213ps_zmm_k1_zmm_zmmmt = 4746,
  MVEX_Vfnmadd213pd_zmm_k1_zmm_zmmmt = 4747,
  MVEX_Vfnmsub213ps_zmm_k1_zmm_zmmmt = 4748,
  MVEX_Vfnmsub213pd_zmm_k1_zmm_zmmmt = 4749,
  MVEX_Undoc_zmm_k1_mvt_512_66_0F38_W0_B0 = 4750,
  MVEX_Undoc_zmm_k1_mvt_512_66_0F38_W0_B2 = 4751,
  MVEX_Vpmadd233d_zmm_k1_zmm_zmmmt = 4752,
  MVEX_Vpmadd231d_zmm_k1_zmm_zmmmt = 4753,
  MVEX_Vfmadd231ps_zmm_k1_zmm_zmmmt = 4754,
  MVEX_Vfmadd231pd_zmm_k1_zmm_zmmmt = 4755,
  MVEX_Vfmsub231ps_zmm_k1_zmm_zmmmt = 4756,
  MVEX_Vfmsub231pd_zmm_k1_zmm_zmmmt = 4757,
  MVEX_Vfnmadd231ps_zmm_k1_zmm_zmmmt = 4758,
  MVEX_Vfnmadd231pd_zmm_k1_zmm_zmmmt = 4759,
  MVEX_Vfnmsub231ps_zmm_k1_zmm_zmmmt = 4760,
  MVEX_Vfnmsub231pd_zmm_k1_zmm_zmmmt = 4761,
  MVEX_Undoc_zmm_k1_mvt_512_66_0F38_W0_C0 = 4762,
  MVEX_Vgatherpf0hintdps_mvt_k1 = 4763,
  MVEX_Vgatherpf0hintdpd_mvt_k1 = 4764,
  MVEX_Vgatherpf0dps_mvt_k1 = 4765,
  MVEX_Vgatherpf1dps_mvt_k1 = 4766,
  MVEX_Vscatterpf0hintdps_mvt_k1 = 4767,
  MVEX_Vscatterpf0hintdpd_mvt_k1 = 4768,
  MVEX_Vscatterpf0dps_mvt_k1 = 4769,
  MVEX_Vscatterpf1dps_mvt_k1 = 4770,
  MVEX_Vexp223ps_zmm_k1_zmmmt = 4771,
  MVEX_Vlog2ps_zmm_k1_zmmmt = 4772,
  MVEX_Vrcp23ps_zmm_k1_zmmmt = 4773,
  MVEX_Vrsqrt23ps_zmm_k1_zmmmt = 4774,
  MVEX_Vaddsetsps_zmm_k1_zmm_zmmmt = 4775,
  MVEX_Vpaddsetsd_zmm_k1_zmm_zmmmt = 4776,
  MVEX_Undoc_zmm_k1_zmm_zmmmt_512_66_0F38_W0_CE = 4777,
  MVEX_Undoc_zmm_k1_zmm_zmmmt_512_66_0F38_W1_CE = 4778,
  MVEX_Undoc_zmm_k1_zmm_zmmmt_512_66_0F38_W0_CF = 4779,
  MVEX_Vloadunpackld_zmm_k1_mt = 4780,
  MVEX_Vloadunpacklq_zmm_k1_mt = 4781,
  MVEX_Vpackstoreld_mt_k1_zmm = 4782,
  MVEX_Vpackstorelq_mt_k1_zmm = 4783,
  MVEX_Vloadunpacklps_zmm_k1_mt = 4784,
  MVEX_Vloadunpacklpd_zmm_k1_mt = 4785,
  MVEX_Vpackstorelps_mt_k1_zmm = 4786,
  MVEX_Vpackstorelpd_mt_k1_zmm = 4787,
  MVEX_Undoc_zmm_k1_zmmmt_512_0F38_W0_D2 = 4788,
  MVEX_Undoc_zmm_k1_zmmmt_512_66_0F38_W0_D2 = 4789,
  MVEX_Undoc_zmm_k1_zmmmt_512_0F38_W0_D3 = 4790,
  MVEX_Vloadunpackhd_zmm_k1_mt = 4791,
  MVEX_Vloadunpackhq_zmm_k1_mt = 4792,
  MVEX_Vpackstorehd_mt_k1_zmm = 4793,
  MVEX_Vpackstorehq_mt_k1_zmm = 4794,
  MVEX_Vloadunpackhps_zmm_k1_mt = 4795,
  MVEX_Vloadunpackhpd_zmm_k1_mt = 4796,
  MVEX_Vpackstorehps_mt_k1_zmm = 4797,
  MVEX_Vpackstorehpd_mt_k1_zmm = 4798,
  MVEX_Undoc_zmm_k1_zmmmt_512_0F38_W0_D6 = 4799,
  MVEX_Undoc_zmm_k1_zmmmt_512_66_0F38_W0_D6 = 4800,
  MVEX_Undoc_zmm_k1_zmmmt_512_0F38_W0_D7 = 4801,
  MVEX_Valignd_zmm_k1_zmm_zmmmt_imm8 = 4802,
  MVEX_Vpermf32x4_zmm_k1_zmmmt_imm8 = 4803,
  MVEX_Vpcmpud_kr_k1_zmm_zmmmt_imm8 = 4804,
  MVEX_Vpcmpd_kr_k1_zmm_zmmmt_imm8 = 4805,
  MVEX_Vgetmantps_zmm_k1_zmmmt_imm8 = 4806,
  MVEX_Vgetmantpd_zmm_k1_zmmmt_imm8 = 4807,
  MVEX_Vrndfxpntps_zmm_k1_zmmmt_imm8 = 4808,
  MVEX_Vrndfxpntpd_zmm_k1_zmmmt_imm8 = 4809,
  MVEX_Vcvtfxpntudq2ps_zmm_k1_zmmmt_imm8 = 4810,
  MVEX_Vcvtfxpntps2udq_zmm_k1_zmmmt_imm8 = 4811,
  MVEX_Vcvtfxpntpd2udq_zmm_k1_zmmmt_imm8 = 4812,
  MVEX_Vcvtfxpntdq2ps_zmm_k1_zmmmt_imm8 = 4813,
  MVEX_Vcvtfxpntps2dq_zmm_k1_zmmmt_imm8 = 4814,
  MVEX_Undoc_zmm_k1_zmmmt_imm8_512_66_0F3A_W0_D0 = 4815,
  MVEX_Undoc_zmm_k1_zmmmt_imm8_512_66_0F3A_W0_D1 = 4816,
  MVEX_Vcvtfxpntpd2dq_zmm_k1_zmmmt_imm8 = 4817,
  Via_undoc_F30FA6F0_16 = 4818,
  Via_undoc_F30FA6F0_32 = 4819,
  Via_undoc_F30FA6F0_64 = 4820,
  Via_undoc_F30FA6F8_16 = 4821,
  Via_undoc_F30FA6F8_32 = 4822,
  Via_undoc_F30FA6F8_64 = 4823,
  Xsha512_16 = 4824,
  Xsha512_32 = 4825,
  Xsha512_64 = 4826,
  Xstore_alt_16 = 4827,
  Xstore_alt_32 = 4828,
  Xstore_alt_64 = 4829,
  Xsha512_alt_16 = 4830,
  Xsha512_alt_32 = 4831,
  Xsha512_alt_64 = 4832,
  Zero_bytes = 4833,
  Wrmsrns = 4834,
  Wrmsrlist = 4835,
  Rdmsrlist = 4836,
  Rmpquery = 4837,
  Prefetchit1_m8 = 4838,
  Prefetchit0_m8 = 4839,
  Aadd_m32_r32 = 4840,
  Aadd_m64_r64 = 4841,
  Aand_m32_r32 = 4842,
  Aand_m64_r64 = 4843,
  Axor_m32_r32 = 4844,
  Axor_m64_r64 = 4845,
  Aor_m32_r32 = 4846,
  Aor_m64_r64 = 4847,
  VEX_Vpdpbuud_xmm_xmm_xmmm128 = 4848,
  VEX_Vpdpbuud_ymm_ymm_ymmm256 = 4849,
  VEX_Vpdpbsud_xmm_xmm_xmmm128 = 4850,
  VEX_Vpdpbsud_ymm_ymm_ymmm256 = 4851,
  VEX_Vpdpbssd_xmm_xmm_xmmm128 = 4852,
  VEX_Vpdpbssd_ymm_ymm_ymmm256 = 4853,
  VEX_Vpdpbuuds_xmm_xmm_xmmm128 = 4854,
  VEX_Vpdpbuuds_ymm_ymm_ymmm256 = 4855,
  VEX_Vpdpbsuds_xmm_xmm_xmmm128 = 4856,
  VEX_Vpdpbsuds_ymm_ymm_ymmm256 = 4857,
  VEX_Vpdpbssds_xmm_xmm_xmmm128 = 4858,
  VEX_Vpdpbssds_ymm_ymm_ymmm256 = 4859,
  VEX_Tdpfp16ps_tmm_tmm_tmm = 4860,
  VEX_Vcvtneps2bf16_xmm_xmmm128 = 4861,
  VEX_Vcvtneps2bf16_xmm_ymmm256 = 4862,
  VEX_Vcvtneoph2ps_xmm_m128 = 4863,
  VEX_Vcvtneoph2ps_ymm_m256 = 4864,
  VEX_Vcvtneeph2ps_xmm_m128 = 4865,
  VEX_Vcvtneeph2ps_ymm_m256 = 4866,
  VEX_Vcvtneebf162ps_xmm_m128 = 4867,
  VEX_Vcvtneebf162ps_ymm_m256 = 4868,
  VEX_Vcvtneobf162ps_xmm_m128 = 4869,
  VEX_Vcvtneobf162ps_ymm_m256 = 4870,
  VEX_Vbcstnesh2ps_xmm_m16 = 4871,
  VEX_Vbcstnesh2ps_ymm_m16 = 4872,
  VEX_Vbcstnebf162ps_xmm_m16 = 4873,
  VEX_Vbcstnebf162ps_ymm_m16 = 4874,
  VEX_Vpmadd52luq_xmm_xmm_xmmm128 = 4875,
  VEX_Vpmadd52luq_ymm_ymm_ymmm256 = 4876,
  VEX_Vpmadd52huq_xmm_xmm_xmmm128 = 4877,
  VEX_Vpmadd52huq_ymm_ymm_ymmm256 = 4878,
  VEX_Cmpoxadd_m32_r32_r32 = 4879,
  VEX_Cmpoxadd_m64_r64_r64 = 4880,
  VEX_Cmpnoxadd_m32_r32_r32 = 4881,
  VEX_Cmpnoxadd_m64_r64_r64 = 4882,
  VEX_Cmpbxadd_m32_r32_r32 = 4883,
  VEX_Cmpbxadd_m64_r64_r64 = 4884,
  VEX_Cmpnbxadd_m32_r32_r32 = 4885,
  VEX_Cmpnbxadd_m64_r64_r64 = 4886,
  VEX_Cmpzxadd_m32_r32_r32 = 4887,
  VEX_Cmpzxadd_m64_r64_r64 = 4888,
  VEX_Cmpnzxadd_m32_r32_r32 = 4889,
  VEX_Cmpnzxadd_m64_r64_r64 = 4890,
  VEX_Cmpbexadd_m32_r32_r32 = 4891,
  VEX_Cmpbexadd_m64_r64_r64 = 4892,
  VEX_Cmpnbexadd_m32_r32_r32 = 4893,
  VEX_Cmpnbexadd_m64_r64_r64 = 4894,
  VEX_Cmpsxadd_m32_r32_r32 = 4895,
  VEX_Cmpsxadd_m64_r64_r64 = 4896,
  VEX_Cmpnsxadd_m32_r32_r32 = 4897,
  VEX_Cmpnsxadd_m64_r64_r64 = 4898,
  VEX_Cmppxadd_m32_r32_r32 = 4899,
  VEX_Cmppxadd_m64_r64_r64 = 4900,
  VEX_Cmpnpxadd_m32_r32_r32 = 4901,
  VEX_Cmpnpxadd_m64_r64_r64 = 4902,
  VEX_Cmplxadd_m32_r32_r32 = 4903,
  VEX_Cmplxadd_m64_r64_r64 = 4904,
  VEX_Cmpnlxadd_m32_r32_r32 = 4905,
  VEX_Cmpnlxadd_m64_r64_r64 = 4906,
  VEX_Cmplexadd_m32_r32_r32 = 4907,
  VEX_Cmplexadd_m64_r64_r64 = 4908,
  VEX_Cmpnlexadd_m32_r32_r32 = 4909,
  VEX_Cmpnlexadd_m64_r64_r64 = 4910,
  VEX_Tcmmrlfp16ps_tmm_tmm_tmm = 4911,
  VEX_Tcmmimfp16ps_tmm_tmm_tmm = 4912,
  Pbndkb = 4913,
  VEX_Vsha512rnds2_ymm_ymm_xmm = 4914,
  VEX_Vsha512msg1_ymm_xmm = 4915,
  VEX_Vsha512msg2_ymm_ymm = 4916,
  VEX_Vpdpwuud_xmm_xmm_xmmm128 = 4917,
  VEX_Vpdpwuud_ymm_ymm_ymmm256 = 4918,
  VEX_Vpdpwusd_xmm_xmm_xmmm128 = 4919,
  VEX_Vpdpwusd_ymm_ymm_ymmm256 = 4920,
  VEX_Vpdpwsud_xmm_xmm_xmmm128 = 4921,
  VEX_Vpdpwsud_ymm_ymm_ymmm256 = 4922,
  VEX_Vpdpwuuds_xmm_xmm_xmmm128 = 4923,
  VEX_Vpdpwuuds_ymm_ymm_ymmm256 = 4924,
  VEX_Vpdpwusds_xmm_xmm_xmmm128 = 4925,
  VEX_Vpdpwusds_ymm_ymm_ymmm256 = 4926,
  VEX_Vpdpwsuds_xmm_xmm_xmmm128 = 4927,
  VEX_Vpdpwsuds_ymm_ymm_ymmm256 = 4928,
  VEX_Vsm3msg1_xmm_xmm_xmmm128 = 4929,
  VEX_Vsm3msg2_xmm_xmm_xmmm128 = 4930,
  VEX_Vsm4key4_xmm_xmm_xmmm128 = 4931,
  VEX_Vsm4key4_ymm_ymm_ymmm256 = 4932,
  VEX_Vsm4rnds4_xmm_xmm_xmmm128 = 4933,
  VEX_Vsm4rnds4_ymm_ymm_ymmm256 = 4934,
  VEX_Vsm3rnds2_xmm_xmm_xmmm128_imm8 = 4935,
}
/**
* `CPUID` feature flags
*/
export enum CpuidFeature {
/**
* 8086 or later
*/
  INTEL8086 = 0,
/**
* 8086 only
*/
  INTEL8086_ONLY = 1,
/**
* 80186 or later
*/
  INTEL186 = 2,
/**
* 80286 or later
*/
  INTEL286 = 3,
/**
* 80286 only
*/
  INTEL286_ONLY = 4,
/**
* 80386 or later
*/
  INTEL386 = 5,
/**
* 80386 only
*/
  INTEL386_ONLY = 6,
/**
* 80386 A0-B0 stepping only (`XBTS`, `IBTS` instructions)
*/
  INTEL386_A0_ONLY = 7,
/**
* Intel486 or later
*/
  INTEL486 = 8,
/**
* Intel486 A stepping only (`CMPXCHG`)
*/
  INTEL486_A_ONLY = 9,
/**
* UMOV (80386 and Intel486)
*/
  UMOV = 10,
/**
* IA-64
*/
  IA64 = 11,
/**
* CPUID.80000001H:EDX.LM\[bit 29\]
*/
  X64 = 12,
/**
* CPUID.(EAX=07H, ECX=0H):EBX.ADX\[bit 19\]
*/
  ADX = 13,
/**
* CPUID.01H:ECX.AES\[bit 25\]
*/
  AES = 14,
/**
* CPUID.01H:ECX.AVX\[bit 28\]
*/
  AVX = 15,
/**
* CPUID.(EAX=07H, ECX=0H):EBX.AVX2\[bit 5\]
*/
  AVX2 = 16,
/**
* CPUID.(EAX=07H, ECX=0H):EDX.AVX512_4FMAPS\[bit 3\]
*/
  AVX512_4FMAPS = 17,
/**
* CPUID.(EAX=07H, ECX=0H):EDX.AVX512_4VNNIW\[bit 2\]
*/
  AVX512_4VNNIW = 18,
/**
* CPUID.(EAX=07H, ECX=1H):EAX.AVX512_BF16\[bit 5\]
*/
  AVX512_BF16 = 19,
/**
* CPUID.(EAX=07H, ECX=0H):ECX.AVX512_BITALG\[bit 12\]
*/
  AVX512_BITALG = 20,
/**
* CPUID.(EAX=07H, ECX=0H):EBX.AVX512_IFMA\[bit 21\]
*/
  AVX512_IFMA = 21,
/**
* CPUID.(EAX=07H, ECX=0H):ECX.AVX512_VBMI\[bit 1\]
*/
  AVX512_VBMI = 22,
/**
* CPUID.(EAX=07H, ECX=0H):ECX.AVX512_VBMI2\[bit 6\]
*/
  AVX512_VBMI2 = 23,
/**
* CPUID.(EAX=07H, ECX=0H):ECX.AVX512_VNNI\[bit 11\]
*/
  AVX512_VNNI = 24,
/**
* CPUID.(EAX=07H, ECX=0H):EDX.AVX512_VP2INTERSECT\[bit 08\]
*/
  AVX512_VP2INTERSECT = 25,
/**
* CPUID.(EAX=07H, ECX=0H):ECX.AVX512_VPOPCNTDQ\[bit 14\]
*/
  AVX512_VPOPCNTDQ = 26,
/**
* CPUID.(EAX=07H, ECX=0H):EBX.AVX512BW\[bit 30\]
*/
  AVX512BW = 27,
/**
* CPUID.(EAX=07H, ECX=0H):EBX.AVX512CD\[bit 28\]
*/
  AVX512CD = 28,
/**
* CPUID.(EAX=07H, ECX=0H):EBX.AVX512DQ\[bit 17\]
*/
  AVX512DQ = 29,
/**
* CPUID.(EAX=07H, ECX=0H):EBX.AVX512ER\[bit 27\]
*/
  AVX512ER = 30,
/**
* CPUID.(EAX=07H, ECX=0H):EBX.AVX512F\[bit 16\]
*/
  AVX512F = 31,
/**
* CPUID.(EAX=07H, ECX=0H):EBX.AVX512PF\[bit 26\]
*/
  AVX512PF = 32,
/**
* CPUID.(EAX=07H, ECX=0H):EBX.AVX512VL\[bit 31\]
*/
  AVX512VL = 33,
/**
* CPUID.(EAX=07H, ECX=0H):EBX.BMI1\[bit 3\]
*/
  BMI1 = 34,
/**
* CPUID.(EAX=07H, ECX=0H):EBX.BMI2\[bit 8\]
*/
  BMI2 = 35,
/**
* CPUID.(EAX=07H, ECX=0H):EDX.CET_IBT\[bit 20\]
*/
  CET_IBT = 36,
/**
* CPUID.(EAX=07H, ECX=0H):ECX.CET_SS\[bit 7\]
*/
  CET_SS = 37,
/**
* `CL1INVMB` instruction (Intel SCC = Single-Chip Computer)
*/
  CL1INVMB = 38,
/**
* CPUID.(EAX=07H, ECX=0H):ECX.CLDEMOTE\[bit 25\]
*/
  CLDEMOTE = 39,
/**
* CPUID.(EAX=07H, ECX=0H):EBX.CLFLUSHOPT\[bit 23\]
*/
  CLFLUSHOPT = 40,
/**
* CPUID.01H:EDX.CLFSH\[bit 19\]
*/
  CLFSH = 41,
/**
* CPUID.(EAX=07H, ECX=0H):EBX.CLWB\[bit 24\]
*/
  CLWB = 42,
/**
* CPUID.80000008H:EBX.CLZERO\[bit 0\]
*/
  CLZERO = 43,
/**
* CPUID.01H:EDX.CMOV\[bit 15\]
*/
  CMOV = 44,
/**
* CPUID.01H:ECX.CMPXCHG16B\[bit 13\]
*/
  CMPXCHG16B = 45,
/**
* `RFLAGS.ID` can be toggled
*/
  CPUID = 46,
/**
* CPUID.01H:EDX.CX8\[bit 8\]
*/
  CX8 = 47,
/**
* CPUID.80000001H:EDX.3DNOW\[bit 31\]
*/
  D3NOW = 48,
/**
* CPUID.80000001H:EDX.3DNOWEXT\[bit 30\]
*/
  D3NOWEXT = 49,
/**
* CPUID.(EAX=12H, ECX=0H):EAX.OSS\[bit 5\]
*/
  OSS = 50,
/**
* CPUID.(EAX=07H, ECX=0H):ECX.ENQCMD\[bit 29\]
*/
  ENQCMD = 51,
/**
* CPUID.01H:ECX.F16C\[bit 29\]
*/
  F16C = 52,
/**
* CPUID.01H:ECX.FMA\[bit 12\]
*/
  FMA = 53,
/**
* CPUID.80000001H:ECX.FMA4\[bit 16\]
*/
  FMA4 = 54,
/**
* 8087 or later (CPUID.01H:EDX.FPU\[bit 0\])
*/
  FPU = 55,
/**
* 80287 or later
*/
  FPU287 = 56,
/**
* 80287XL only
*/
  FPU287XL_ONLY = 57,
/**
* 80387 or later
*/
  FPU387 = 58,
/**
* 80387SL only
*/
  FPU387SL_ONLY = 59,
/**
* CPUID.(EAX=07H, ECX=0H):EBX.FSGSBASE\[bit 0\]
*/
  FSGSBASE = 60,
/**
* CPUID.01H:EDX.FXSR\[bit 24\]
*/
  FXSR = 61,
/**
* Cyrix (AMD Geode GX/LX) 3DNow! instructions
*/
  CYRIX_D3NOW = 62,
/**
* CPUID.(EAX=07H, ECX=0H):ECX.GFNI\[bit 8\]
*/
  GFNI = 63,
/**
* CPUID.(EAX=07H, ECX=0H):EBX.HLE\[bit 4\]
*/
  HLE = 64,
/**
* [`HLE`] or [`RTM`]
*
* [`HLE`]: enum.CpuidFeature.html#variant.HLE
* [`RTM`]: enum.CpuidFeature.html#variant.RTM
*/
  HLE_or_RTM = 65,
/**
* IA32_VMX_EPT_VPID_CAP\[bit 20\]
*/
  INVEPT = 66,
/**
* CPUID.(EAX=07H, ECX=0H):EBX.INVPCID\[bit 10\]
*/
  INVPCID = 67,
/**
* IA32_VMX_EPT_VPID_CAP\[bit 32\]
*/
  INVVPID = 68,
/**
* CPUID.80000001H:ECX.LWP\[bit 15\]
*/
  LWP = 69,
/**
* CPUID.80000001H:ECX.LZCNT\[bit 5\]
*/
  LZCNT = 70,
/**
* CPUID.80000008H:EBX.MCOMMIT\[bit 8\]
*/
  MCOMMIT = 71,
/**
* CPUID.01H:EDX.MMX\[bit 23\]
*/
  MMX = 72,
/**
* CPUID.01H:ECX.MONITOR\[bit 3\]
*/
  MONITOR = 73,
/**
* CPUID.80000001H:ECX.MONITORX\[bit 29\]
*/
  MONITORX = 74,
/**
* CPUID.01H:ECX.MOVBE\[bit 22\]
*/
  MOVBE = 75,
/**
* CPUID.(EAX=07H, ECX=0H):ECX.MOVDIR64B\[bit 28\]
*/
  MOVDIR64B = 76,
/**
* CPUID.(EAX=07H, ECX=0H):ECX.MOVDIRI\[bit 27\]
*/
  MOVDIRI = 77,
/**
* CPUID.(EAX=07H, ECX=0H):EBX.MPX\[bit 14\]
*/
  MPX = 78,
/**
* CPUID.01H:EDX.MSR\[bit 5\]
*/
  MSR = 79,
/**
* Multi-byte nops (`0F1F /0`): CPUID.01H.EAX\[Bits 11:8\] = 0110B or 1111B
*/
  MULTIBYTENOP = 80,
/**
* CPUID.0C0000000H:EAX >= 0C0000001H AND CPUID.0C0000001H:EDX.ACE\[Bits 7:6\] = 11B (\[6\] = exists, \[7\] = enabled)
*/
  PADLOCK_ACE = 81,
/**
* CPUID.0C0000000H:EAX >= 0C0000001H AND CPUID.0C0000001H:EDX.PHE\[Bits 11:10\] = 11B (\[10\] = exists, \[11\] = enabled)
*/
  PADLOCK_PHE = 82,
/**
* CPUID.0C0000000H:EAX >= 0C0000001H AND CPUID.0C0000001H:EDX.PMM\[Bits 13:12\] = 11B (\[12\] = exists, \[13\] = enabled)
*/
  PADLOCK_PMM = 83,
/**
* CPUID.0C0000000H:EAX >= 0C0000001H AND CPUID.0C0000001H:EDX.RNG\[Bits 3:2\] = 11B (\[2\] = exists, \[3\] = enabled)
*/
  PADLOCK_RNG = 84,
/**
* `PAUSE` instruction (Pentium 4 or later)
*/
  PAUSE = 85,
/**
* CPUID.01H:ECX.PCLMULQDQ\[bit 1\]
*/
  PCLMULQDQ = 86,
/**
* CPUID.(EAX=07H, ECX=0H):EBX.PCOMMIT\[bit 22\]
*/
  PCOMMIT = 87,
/**
* CPUID.(EAX=07H, ECX=0H):EDX.PCONFIG\[bit 18\]
*/
  PCONFIG = 88,
/**
* CPUID.(EAX=07H, ECX=0H):ECX.PKU\[bit 3\]
*/
  PKU = 89,
/**
* CPUID.01H:ECX.POPCNT\[bit 23\]
*/
  POPCNT = 90,
/**
* CPUID.80000001H:ECX.PREFETCHW\[bit 8\]
*/
  PREFETCHW = 91,
/**
* CPUID.(EAX=07H, ECX=0H):ECX.PREFETCHWT1\[bit 0\]
*/
  PREFETCHWT1 = 92,
/**
* CPUID.(EAX=14H, ECX=0H):EBX.PTWRITE\[bit 4\]
*/
  PTWRITE = 93,
/**
* CPUID.(EAX=07H, ECX=0H):ECX.RDPID\[bit 22\]
*/
  RDPID = 94,
/**
* `RDPMC` instruction (Pentium MMX or later, or Pentium Pro or later)
*/
  RDPMC = 95,
/**
* CPUID.80000008H:EBX.RDPRU\[bit 4\]
*/
  RDPRU = 96,
/**
* CPUID.01H:ECX.RDRAND\[bit 30\]
*/
  RDRAND = 97,
/**
* CPUID.(EAX=07H, ECX=0H):EBX.RDSEED\[bit 18\]
*/
  RDSEED = 98,
/**
* CPUID.80000001H:EDX.RDTSCP\[bit 27\]
*/
  RDTSCP = 99,
/**
* CPUID.(EAX=07H, ECX=0H):EBX.RTM\[bit 11\]
*/
  RTM = 100,
/**
* CPUID.01H:EDX.SEP\[bit 11\]
*/
  SEP = 101,
/**
* CPUID.(EAX=12H, ECX=0H):EAX.SGX1\[bit 0\]
*/
  SGX1 = 102,
/**
* CPUID.(EAX=07H, ECX=0H):EBX.SHA\[bit 29\]
*/
  SHA = 103,
/**
* CPUID.80000001H:ECX.SKINIT\[bit 12\]
*/
  SKINIT = 104,
/**
* [`SKINIT`] or [`SVM`]
*
* [`SKINIT`]: enum.CpuidFeature.html#variant.SKINIT
* [`SVM`]: enum.CpuidFeature.html#variant.SVM
*/
  SKINIT_or_SVM = 105,
/**
* CPUID.(EAX=07H, ECX=0H):EBX.SMAP\[bit 20\]
*/
  SMAP = 106,
/**
* CPUID.01H:ECX.SMX\[bit 6\]
*/
  SMX = 107,
/**
* CPUID.01H:EDX.SSE\[bit 25\]
*/
  SSE = 108,
/**
* CPUID.01H:EDX.SSE2\[bit 26\]
*/
  SSE2 = 109,
/**
* CPUID.01H:ECX.SSE3\[bit 0\]
*/
  SSE3 = 110,
/**
* CPUID.01H:ECX.SSE4_1\[bit 19\]
*/
  SSE4_1 = 111,
/**
* CPUID.01H:ECX.SSE4_2\[bit 20\]
*/
  SSE4_2 = 112,
/**
* CPUID.80000001H:ECX.SSE4A\[bit 6\]
*/
  SSE4A = 113,
/**
* CPUID.01H:ECX.SSSE3\[bit 9\]
*/
  SSSE3 = 114,
/**
* CPUID.80000001H:ECX.SVM\[bit 2\]
*/
  SVM = 115,
/**
* CPUID.8000001FH:EAX.SEV-ES\[bit 3\]
*/
  SEV_ES = 116,
/**
* CPUID.80000001H:EDX.SYSCALL\[bit 11\]
*/
  SYSCALL = 117,
/**
* CPUID.80000001H:ECX.TBM\[bit 21\]
*/
  TBM = 118,
/**
* CPUID.01H:EDX.TSC\[bit 4\]
*/
  TSC = 119,
/**
* CPUID.(EAX=07H, ECX=0H):ECX.VAES\[bit 9\]
*/
  VAES = 120,
/**
* CPUID.01H:ECX.VMX\[bit 5\]
*/
  VMX = 121,
/**
* CPUID.(EAX=07H, ECX=0H):ECX.VPCLMULQDQ\[bit 10\]
*/
  VPCLMULQDQ = 122,
/**
* CPUID.(EAX=07H, ECX=0H):ECX.WAITPKG\[bit 5\]
*/
  WAITPKG = 123,
/**
* CPUID.(EAX=80000008H, ECX=0H):EBX.WBNOINVD\[bit 9\]
*/
  WBNOINVD = 124,
/**
* CPUID.80000001H:ECX.XOP\[bit 11\]
*/
  XOP = 125,
/**
* CPUID.01H:ECX.XSAVE\[bit 26\]
*/
  XSAVE = 126,
/**
* CPUID.(EAX=0DH, ECX=1H):EAX.XSAVEC\[bit 1\]
*/
  XSAVEC = 127,
/**
* CPUID.(EAX=0DH, ECX=1H):EAX.XSAVEOPT\[bit 0\]
*/
  XSAVEOPT = 128,
/**
* CPUID.(EAX=0DH, ECX=1H):EAX.XSAVES\[bit 3\]
*/
  XSAVES = 129,
/**
* CPUID.8000001FH:EAX.SEV-SNP\[bit 4\]
*/
  SEV_SNP = 130,
/**
* CPUID.(EAX=07H, ECX=0H):EDX.SERIALIZE\[bit 14\]
*/
  SERIALIZE = 131,
/**
* CPUID.(EAX=07H, ECX=0H):EDX.TSXLDTRK\[bit 16\]
*/
  TSXLDTRK = 132,
/**
* CPUID.80000008H:EBX.INVLPGB\[bit 3\]
*/
  INVLPGB = 133,
/**
* CPUID.(EAX=07H, ECX=0H):EDX.AMX-BF16\[bit 22\]
*/
  AMX_BF16 = 134,
/**
* CPUID.(EAX=07H, ECX=0H):EDX.AMX-TILE\[bit 24\]
*/
  AMX_TILE = 135,
/**
* CPUID.(EAX=07H, ECX=0H):EDX.AMX-INT8\[bit 25\]
*/
  AMX_INT8 = 136,
/**
* Cyrix FPU instructions (Cyrix, AMD Geode GX/LX)
*/
  CYRIX_FPU = 137,
/**
* Cyrix SMM instructions: `SVDC`, `RSDC`, `SVLDT`, `RSLDT`, `SVTS`, `RSTS` (Cyrix, AMD Geode GX/LX)
*/
  CYRIX_SMM = 138,
/**
* Cyrix `SMINT 0F38` (6x86MX and later, AMD Geode GX/LX)
*/
  CYRIX_SMINT = 139,
/**
* Cyrix `SMINT 0F7E` (6x86 or earlier)
*/
  CYRIX_SMINT_0F7E = 140,
/**
* Cyrix SMM instructions: `RDSHR`, `WRSHR` (6x86MX, M II, Cyrix III)
*/
  CYRIX_SHR = 141,
/**
* Cyrix DDI instructions: `BB0_Reset`, `BB1_Reset`, `CPU_READ`, `CPU_WRITE` (MediaGX, GXm, GXLV, GX1)
*/
  CYRIX_DDI = 142,
/**
* Cyrix AND CPUID.80000001H:EDX.EMMI\[bit 24\]
*/
  CYRIX_EMMI = 143,
/**
* Cyrix DMI instructions: `DMINT`, `RDM` (AMD Geode GX/LX)
*/
  CYRIX_DMI = 144,
/**
* CPUID.0C0000000H:EAX >= 0C0000001H AND CPUID.0C0000001H:EDX.AIS\[Bits 1:0\] = 11B (\[0\] = exists, \[1\] = enabled)
*/
  CENTAUR_AIS = 145,
/**
* MOV to/from TR (80386, Intel486, Cyrix, Geode)
*/
  MOV_TR = 146,
/**
* `RSM` instruction (some 386s, some 486s, Pentium and later)
*/
  SMM = 147,
/**
* CPUID.(EAX=??H, ECX=?H):???.????\[bit ??\]
*/
  TDX = 148,
/**
* CPUID.(EAX=07H, ECX=0H):ECX.KL\[bit 23\]
*/
  KL = 149,
/**
* CPUID.19H:EBX.AESKLE\[bit 0\]
*/
  AESKLE = 150,
/**
* CPUID.19H:EBX.WIDE_KL\[bit 2\]
*/
  WIDE_KL = 151,
/**
* CPUID.(EAX=07H, ECX=0H):EDX.UINTR\[bit 5\]
*/
  UINTR = 152,
/**
* CPUID.(EAX=07H, ECX=01H):EAX.HRESET\[bit 22\]
*/
  HRESET = 153,
/**
* CPUID.(EAX=07H, ECX=01H):EAX.AVX-VNNI\[bit 4\]
*/
  AVX_VNNI = 154,
/**
* CPUID.0C0000000H:EAX >= 0C0000001H AND CPUID.0C0000001H:EDX.GMI\[Bits 5:4\] = 11B (\[4\] = exists, \[5\] = enabled)
*/
  PADLOCK_GMI = 155,
/**
* CPUID.(EAX=07H, ECX=01H):EAX.FRED\[bit 17\]
*/
  FRED = 156,
/**
* CPUID.(EAX=07H, ECX=01H):EAX.LKGS\[bit 18\]
*/
  LKGS = 157,
/**
* CPUID.(EAX=07H, ECX=0H):EDX.AVX512-FP16\[bit 23\]
*/
  AVX512_FP16 = 158,
/**
* Undocumented Intel `RDUDBG` and `WRUDBG` instructions
*/
  UDBG = 159,
/**
* Intel Knights Corner
*/
  KNC = 160,
/**
* Undocumented instruction
*/
  PADLOCK_UNDOC = 161,
/**
* CPUID.8000001FH:EAX.RMPQUERY\[bit 6\]
*/
  RMPQUERY = 162,
/**
* CPUID.(EAX=07H, ECX=1H):EAX.RAO-INT\[bit 3\]
*/
  RAO_INT = 163,
/**
* CPUID.(EAX=07H, ECX=1H):EDX.PREFETCHITI\[bit 14\]
*/
  PREFETCHITI = 164,
/**
* CPUID.(EAX=07H, ECX=1H):EAX.AMX-FP16\[bit 21\]
*/
  AMX_FP16 = 165,
/**
* CPUID.(EAX=07H, ECX=1H):EAX.CMPCCXADD\[bit 7\]
*/
  CMPCCXADD = 166,
/**
* CPUID.(EAX=07H, ECX=1H):EAX.AVX-IFMA\[bit 23\]
*/
  AVX_IFMA = 167,
/**
* CPUID.(EAX=07H, ECX=1H):EDX.AVX-NE-CONVERT\[bit 5\]
*/
  AVX_NE_CONVERT = 168,
/**
* CPUID.(EAX=07H, ECX=1H):EDX.AVX-VNNI-INT8\[bit 4\]
*/
  AVX_VNNI_INT8 = 169,
/**
* CPUID.(EAX=07H, ECX=1H):EAX.MSRLIST\[bit 27\]
*/
  MSRLIST = 170,
/**
* CPUID.(EAX=07H, ECX=1H):EAX.WRMSRNS\[bit 19\]
*/
  WRMSRNS = 171,
/**
* CPUID.(EAX=07H, ECX=1H):EDX.AMX-COMPLEX\[bit 8\]
*/
  AMX_COMPLEX = 172,
/**
* CPUID.(EAX=07H, ECX=1H):EAX.SHA512\[bit 0\]
*/
  SHA512 = 173,
/**
* CPUID.(EAX=07H, ECX=1H):EAX.SM3\[bit 1\]
*/
  SM3 = 174,
/**
* CPUID.(EAX=07H, ECX=1H):EAX.SM4\[bit 2\]
*/
  SM4 = 175,
/**
* CPUID.(EAX=07H, ECX=1H):EBX.TSE\[bit 1\]
*/
  TSE = 176,
/**
* CPUID.(EAX=07H, ECX=1H):EDX.AVX-VNNI-INT16\[bit 10\]
*/
  AVX_VNNI_INT16 = 177,
}
/**
* Mnemonic
*/
export enum Mnemonic {
  INVALID = 0,
  Aaa = 1,
  Aad = 2,
  Aam = 3,
  Aas = 4,
  Adc = 5,
  Adcx = 6,
  Add = 7,
  Addpd = 8,
  Addps = 9,
  Addsd = 10,
  Addss = 11,
  Addsubpd = 12,
  Addsubps = 13,
  Adox = 14,
  Aesdec = 15,
  Aesdeclast = 16,
  Aesenc = 17,
  Aesenclast = 18,
  Aesimc = 19,
  Aeskeygenassist = 20,
  And = 21,
  Andn = 22,
  Andnpd = 23,
  Andnps = 24,
  Andpd = 25,
  Andps = 26,
  Arpl = 27,
  Bextr = 28,
  Blcfill = 29,
  Blci = 30,
  Blcic = 31,
  Blcmsk = 32,
  Blcs = 33,
  Blendpd = 34,
  Blendps = 35,
  Blendvpd = 36,
  Blendvps = 37,
  Blsfill = 38,
  Blsi = 39,
  Blsic = 40,
  Blsmsk = 41,
  Blsr = 42,
  Bndcl = 43,
  Bndcn = 44,
  Bndcu = 45,
  Bndldx = 46,
  Bndmk = 47,
  Bndmov = 48,
  Bndstx = 49,
  Bound = 50,
  Bsf = 51,
  Bsr = 52,
  Bswap = 53,
  Bt = 54,
  Btc = 55,
  Btr = 56,
  Bts = 57,
  Bzhi = 58,
  Call = 59,
  Cbw = 60,
  Cdq = 61,
  Cdqe = 62,
  Cl1invmb = 63,
  Clac = 64,
  Clc = 65,
  Cld = 66,
  Cldemote = 67,
  Clflush = 68,
  Clflushopt = 69,
  Clgi = 70,
  Cli = 71,
  Clrssbsy = 72,
  Clts = 73,
  Clwb = 74,
  Clzero = 75,
  Cmc = 76,
  Cmova = 77,
  Cmovae = 78,
  Cmovb = 79,
  Cmovbe = 80,
  Cmove = 81,
  Cmovg = 82,
  Cmovge = 83,
  Cmovl = 84,
  Cmovle = 85,
  Cmovne = 86,
  Cmovno = 87,
  Cmovnp = 88,
  Cmovns = 89,
  Cmovo = 90,
  Cmovp = 91,
  Cmovs = 92,
  Cmp = 93,
  Cmppd = 94,
  Cmpps = 95,
  Cmpsb = 96,
  Cmpsd = 97,
  Cmpsq = 98,
  Cmpss = 99,
  Cmpsw = 100,
  Cmpxchg = 101,
  Cmpxchg16b = 102,
  Cmpxchg8b = 103,
  Comisd = 104,
  Comiss = 105,
  Cpuid = 106,
  Cqo = 107,
  Crc32 = 108,
  Cvtdq2pd = 109,
  Cvtdq2ps = 110,
  Cvtpd2dq = 111,
  Cvtpd2pi = 112,
  Cvtpd2ps = 113,
  Cvtpi2pd = 114,
  Cvtpi2ps = 115,
  Cvtps2dq = 116,
  Cvtps2pd = 117,
  Cvtps2pi = 118,
  Cvtsd2si = 119,
  Cvtsd2ss = 120,
  Cvtsi2sd = 121,
  Cvtsi2ss = 122,
  Cvtss2sd = 123,
  Cvtss2si = 124,
  Cvttpd2dq = 125,
  Cvttpd2pi = 126,
  Cvttps2dq = 127,
  Cvttps2pi = 128,
  Cvttsd2si = 129,
  Cvttss2si = 130,
  Cwd = 131,
  Cwde = 132,
  Daa = 133,
  Das = 134,
  Db = 135,
  Dd = 136,
  Dec = 137,
  Div = 138,
  Divpd = 139,
  Divps = 140,
  Divsd = 141,
  Divss = 142,
  Dppd = 143,
  Dpps = 144,
  Dq = 145,
  Dw = 146,
  Emms = 147,
  Encls = 148,
  Enclu = 149,
  Enclv = 150,
  Endbr32 = 151,
  Endbr64 = 152,
  Enqcmd = 153,
  Enqcmds = 154,
  Enter = 155,
  Extractps = 156,
  Extrq = 157,
  F2xm1 = 158,
  Fabs = 159,
  Fadd = 160,
  Faddp = 161,
  Fbld = 162,
  Fbstp = 163,
  Fchs = 164,
  Fclex = 165,
  Fcmovb = 166,
  Fcmovbe = 167,
  Fcmove = 168,
  Fcmovnb = 169,
  Fcmovnbe = 170,
  Fcmovne = 171,
  Fcmovnu = 172,
  Fcmovu = 173,
  Fcom = 174,
  Fcomi = 175,
  Fcomip = 176,
  Fcomp = 177,
  Fcompp = 178,
  Fcos = 179,
  Fdecstp = 180,
  Fdisi = 181,
  Fdiv = 182,
  Fdivp = 183,
  Fdivr = 184,
  Fdivrp = 185,
  Femms = 186,
  Feni = 187,
  Ffree = 188,
  Ffreep = 189,
  Fiadd = 190,
  Ficom = 191,
  Ficomp = 192,
  Fidiv = 193,
  Fidivr = 194,
  Fild = 195,
  Fimul = 196,
  Fincstp = 197,
  Finit = 198,
  Fist = 199,
  Fistp = 200,
  Fisttp = 201,
  Fisub = 202,
  Fisubr = 203,
  Fld = 204,
  Fld1 = 205,
  Fldcw = 206,
  Fldenv = 207,
  Fldl2e = 208,
  Fldl2t = 209,
  Fldlg2 = 210,
  Fldln2 = 211,
  Fldpi = 212,
  Fldz = 213,
  Fmul = 214,
  Fmulp = 215,
  Fnclex = 216,
  Fndisi = 217,
  Fneni = 218,
  Fninit = 219,
  Fnop = 220,
  Fnsave = 221,
  Fnsetpm = 222,
  Fnstcw = 223,
  Fnstenv = 224,
  Fnstsw = 225,
  Fpatan = 226,
  Fprem = 227,
  Fprem1 = 228,
  Fptan = 229,
  Frndint = 230,
  Frstor = 231,
  Frstpm = 232,
  Fsave = 233,
  Fscale = 234,
  Fsetpm = 235,
  Fsin = 236,
  Fsincos = 237,
  Fsqrt = 238,
  Fst = 239,
  Fstcw = 240,
  Fstdw = 241,
  Fstenv = 242,
  Fstp = 243,
  Fstpnce = 244,
  Fstsg = 245,
  Fstsw = 246,
  Fsub = 247,
  Fsubp = 248,
  Fsubr = 249,
  Fsubrp = 250,
  Ftst = 251,
  Fucom = 252,
  Fucomi = 253,
  Fucomip = 254,
  Fucomp = 255,
  Fucompp = 256,
  Fxam = 257,
  Fxch = 258,
  Fxrstor = 259,
  Fxrstor64 = 260,
  Fxsave = 261,
  Fxsave64 = 262,
  Fxtract = 263,
  Fyl2x = 264,
  Fyl2xp1 = 265,
  Getsec = 266,
  Gf2p8affineinvqb = 267,
  Gf2p8affineqb = 268,
  Gf2p8mulb = 269,
  Haddpd = 270,
  Haddps = 271,
  Hlt = 272,
  Hsubpd = 273,
  Hsubps = 274,
  Ibts = 275,
  Idiv = 276,
  Imul = 277,
  In = 278,
  Inc = 279,
  Incsspd = 280,
  Incsspq = 281,
  Insb = 282,
  Insd = 283,
  Insertps = 284,
  Insertq = 285,
  Insw = 286,
  Int = 287,
  Int1 = 288,
  Into = 289,
  Invd = 290,
  Invept = 291,
  Invlpg = 292,
  Invlpga = 293,
  Invpcid = 294,
  Invvpid = 295,
  Iret = 296,
  Ja = 297,
  Jae = 298,
  Jb = 299,
  Jbe = 300,
  Jcxz = 301,
  Je = 302,
  Jecxz = 303,
  Jg = 304,
  Jge = 305,
  Jl = 306,
  Jle = 307,
  Jmp = 308,
  Jmpe = 309,
  Jne = 310,
  Jno = 311,
  Jnp = 312,
  Jns = 313,
  Jo = 314,
  Jp = 315,
  Jrcxz = 316,
  Js = 317,
  Kaddb = 318,
  Kaddd = 319,
  Kaddq = 320,
  Kaddw = 321,
  Kandb = 322,
  Kandd = 323,
  Kandnb = 324,
  Kandnd = 325,
  Kandnq = 326,
  Kandnw = 327,
  Kandq = 328,
  Kandw = 329,
  Kmovb = 330,
  Kmovd = 331,
  Kmovq = 332,
  Kmovw = 333,
  Knotb = 334,
  Knotd = 335,
  Knotq = 336,
  Knotw = 337,
  Korb = 338,
  Kord = 339,
  Korq = 340,
  Kortestb = 341,
  Kortestd = 342,
  Kortestq = 343,
  Kortestw = 344,
  Korw = 345,
  Kshiftlb = 346,
  Kshiftld = 347,
  Kshiftlq = 348,
  Kshiftlw = 349,
  Kshiftrb = 350,
  Kshiftrd = 351,
  Kshiftrq = 352,
  Kshiftrw = 353,
  Ktestb = 354,
  Ktestd = 355,
  Ktestq = 356,
  Ktestw = 357,
  Kunpckbw = 358,
  Kunpckdq = 359,
  Kunpckwd = 360,
  Kxnorb = 361,
  Kxnord = 362,
  Kxnorq = 363,
  Kxnorw = 364,
  Kxorb = 365,
  Kxord = 366,
  Kxorq = 367,
  Kxorw = 368,
  Lahf = 369,
  Lar = 370,
  Lddqu = 371,
  Ldmxcsr = 372,
  Lds = 373,
  Lea = 374,
  Leave = 375,
  Les = 376,
  Lfence = 377,
  Lfs = 378,
  Lgdt = 379,
  Lgs = 380,
  Lidt = 381,
  Lldt = 382,
  Llwpcb = 383,
  Lmsw = 384,
  Loadall = 385,
  Lodsb = 386,
  Lodsd = 387,
  Lodsq = 388,
  Lodsw = 389,
  Loop = 390,
  Loope = 391,
  Loopne = 392,
  Lsl = 393,
  Lss = 394,
  Ltr = 395,
  Lwpins = 396,
  Lwpval = 397,
  Lzcnt = 398,
  Maskmovdqu = 399,
  Maskmovq = 400,
  Maxpd = 401,
  Maxps = 402,
  Maxsd = 403,
  Maxss = 404,
  Mcommit = 405,
  Mfence = 406,
  Minpd = 407,
  Minps = 408,
  Minsd = 409,
  Minss = 410,
  Monitor = 411,
  Monitorx = 412,
  Montmul = 413,
  Mov = 414,
  Movapd = 415,
  Movaps = 416,
  Movbe = 417,
  Movd = 418,
  Movddup = 419,
  Movdir64b = 420,
  Movdiri = 421,
  Movdq2q = 422,
  Movdqa = 423,
  Movdqu = 424,
  Movhlps = 425,
  Movhpd = 426,
  Movhps = 427,
  Movlhps = 428,
  Movlpd = 429,
  Movlps = 430,
  Movmskpd = 431,
  Movmskps = 432,
  Movntdq = 433,
  Movntdqa = 434,
  Movnti = 435,
  Movntpd = 436,
  Movntps = 437,
  Movntq = 438,
  Movntsd = 439,
  Movntss = 440,
  Movq = 441,
  Movq2dq = 442,
  Movsb = 443,
  Movsd = 444,
  Movshdup = 445,
  Movsldup = 446,
  Movsq = 447,
  Movss = 448,
  Movsw = 449,
  Movsx = 450,
  Movsxd = 451,
  Movupd = 452,
  Movups = 453,
  Movzx = 454,
  Mpsadbw = 455,
  Mul = 456,
  Mulpd = 457,
  Mulps = 458,
  Mulsd = 459,
  Mulss = 460,
  Mulx = 461,
  Mwait = 462,
  Mwaitx = 463,
  Neg = 464,
  Nop = 465,
  Not = 466,
  Or = 467,
  Orpd = 468,
  Orps = 469,
  Out = 470,
  Outsb = 471,
  Outsd = 472,
  Outsw = 473,
  Pabsb = 474,
  Pabsd = 475,
  Pabsw = 476,
  Packssdw = 477,
  Packsswb = 478,
  Packusdw = 479,
  Packuswb = 480,
  Paddb = 481,
  Paddd = 482,
  Paddq = 483,
  Paddsb = 484,
  Paddsw = 485,
  Paddusb = 486,
  Paddusw = 487,
  Paddw = 488,
  Palignr = 489,
  Pand = 490,
  Pandn = 491,
  Pause = 492,
  Pavgb = 493,
  Pavgusb = 494,
  Pavgw = 495,
  Pblendvb = 496,
  Pblendw = 497,
  Pclmulqdq = 498,
  Pcmpeqb = 499,
  Pcmpeqd = 500,
  Pcmpeqq = 501,
  Pcmpeqw = 502,
  Pcmpestri = 503,
  Pcmpestri64 = 504,
  Pcmpestrm = 505,
  Pcmpestrm64 = 506,
  Pcmpgtb = 507,
  Pcmpgtd = 508,
  Pcmpgtq = 509,
  Pcmpgtw = 510,
  Pcmpistri = 511,
  Pcmpistrm = 512,
  Pcommit = 513,
  Pconfig = 514,
  Pdep = 515,
  Pext = 516,
  Pextrb = 517,
  Pextrd = 518,
  Pextrq = 519,
  Pextrw = 520,
  Pf2id = 521,
  Pf2iw = 522,
  Pfacc = 523,
  Pfadd = 524,
  Pfcmpeq = 525,
  Pfcmpge = 526,
  Pfcmpgt = 527,
  Pfmax = 528,
  Pfmin = 529,
  Pfmul = 530,
  Pfnacc = 531,
  Pfpnacc = 532,
  Pfrcp = 533,
  Pfrcpit1 = 534,
  Pfrcpit2 = 535,
  Pfrcpv = 536,
  Pfrsqit1 = 537,
  Pfrsqrt = 538,
  Pfrsqrtv = 539,
  Pfsub = 540,
  Pfsubr = 541,
  Phaddd = 542,
  Phaddsw = 543,
  Phaddw = 544,
  Phminposuw = 545,
  Phsubd = 546,
  Phsubsw = 547,
  Phsubw = 548,
  Pi2fd = 549,
  Pi2fw = 550,
  Pinsrb = 551,
  Pinsrd = 552,
  Pinsrq = 553,
  Pinsrw = 554,
  Pmaddubsw = 555,
  Pmaddwd = 556,
  Pmaxsb = 557,
  Pmaxsd = 558,
  Pmaxsw = 559,
  Pmaxub = 560,
  Pmaxud = 561,
  Pmaxuw = 562,
  Pminsb = 563,
  Pminsd = 564,
  Pminsw = 565,
  Pminub = 566,
  Pminud = 567,
  Pminuw = 568,
  Pmovmskb = 569,
  Pmovsxbd = 570,
  Pmovsxbq = 571,
  Pmovsxbw = 572,
  Pmovsxdq = 573,
  Pmovsxwd = 574,
  Pmovsxwq = 575,
  Pmovzxbd = 576,
  Pmovzxbq = 577,
  Pmovzxbw = 578,
  Pmovzxdq = 579,
  Pmovzxwd = 580,
  Pmovzxwq = 581,
  Pmuldq = 582,
  Pmulhrsw = 583,
  Pmulhrw = 584,
  Pmulhuw = 585,
  Pmulhw = 586,
  Pmulld = 587,
  Pmullw = 588,
  Pmuludq = 589,
  Pop = 590,
  Popa = 591,
  Popcnt = 592,
  Popf = 593,
  Por = 594,
  Prefetch = 595,
  Prefetchnta = 596,
  Prefetcht0 = 597,
  Prefetcht1 = 598,
  Prefetcht2 = 599,
  Prefetchw = 600,
  Prefetchwt1 = 601,
  Psadbw = 602,
  Pshufb = 603,
  Pshufd = 604,
  Pshufhw = 605,
  Pshuflw = 606,
  Pshufw = 607,
  Psignb = 608,
  Psignd = 609,
  Psignw = 610,
  Pslld = 611,
  Pslldq = 612,
  Psllq = 613,
  Psllw = 614,
  Psrad = 615,
  Psraw = 616,
  Psrld = 617,
  Psrldq = 618,
  Psrlq = 619,
  Psrlw = 620,
  Psubb = 621,
  Psubd = 622,
  Psubq = 623,
  Psubsb = 624,
  Psubsw = 625,
  Psubusb = 626,
  Psubusw = 627,
  Psubw = 628,
  Pswapd = 629,
  Ptest = 630,
  Ptwrite = 631,
  Punpckhbw = 632,
  Punpckhdq = 633,
  Punpckhqdq = 634,
  Punpckhwd = 635,
  Punpcklbw = 636,
  Punpckldq = 637,
  Punpcklqdq = 638,
  Punpcklwd = 639,
  Push = 640,
  Pusha = 641,
  Pushf = 642,
  Pxor = 643,
  Rcl = 644,
  Rcpps = 645,
  Rcpss = 646,
  Rcr = 647,
  Rdfsbase = 648,
  Rdgsbase = 649,
  Rdmsr = 650,
  Rdpid = 651,
  Rdpkru = 652,
  Rdpmc = 653,
  Rdpru = 654,
  Rdrand = 655,
  Rdseed = 656,
  Rdsspd = 657,
  Rdsspq = 658,
  Rdtsc = 659,
  Rdtscp = 660,
  Reservednop = 661,
  Ret = 662,
  Retf = 663,
  Rol = 664,
  Ror = 665,
  Rorx = 666,
  Roundpd = 667,
  Roundps = 668,
  Roundsd = 669,
  Roundss = 670,
  Rsm = 671,
  Rsqrtps = 672,
  Rsqrtss = 673,
  Rstorssp = 674,
  Sahf = 675,
  Sal = 676,
  Salc = 677,
  Sar = 678,
  Sarx = 679,
  Saveprevssp = 680,
  Sbb = 681,
  Scasb = 682,
  Scasd = 683,
  Scasq = 684,
  Scasw = 685,
  Seta = 686,
  Setae = 687,
  Setb = 688,
  Setbe = 689,
  Sete = 690,
  Setg = 691,
  Setge = 692,
  Setl = 693,
  Setle = 694,
  Setne = 695,
  Setno = 696,
  Setnp = 697,
  Setns = 698,
  Seto = 699,
  Setp = 700,
  Sets = 701,
  Setssbsy = 702,
  Sfence = 703,
  Sgdt = 704,
  Sha1msg1 = 705,
  Sha1msg2 = 706,
  Sha1nexte = 707,
  Sha1rnds4 = 708,
  Sha256msg1 = 709,
  Sha256msg2 = 710,
  Sha256rnds2 = 711,
  Shl = 712,
  Shld = 713,
  Shlx = 714,
  Shr = 715,
  Shrd = 716,
  Shrx = 717,
  Shufpd = 718,
  Shufps = 719,
  Sidt = 720,
  Skinit = 721,
  Sldt = 722,
  Slwpcb = 723,
  Smsw = 724,
  Sqrtpd = 725,
  Sqrtps = 726,
  Sqrtsd = 727,
  Sqrtss = 728,
  Stac = 729,
  Stc = 730,
  Std = 731,
  Stgi = 732,
  Sti = 733,
  Stmxcsr = 734,
  Stosb = 735,
  Stosd = 736,
  Stosq = 737,
  Stosw = 738,
  Str = 739,
  Sub = 740,
  Subpd = 741,
  Subps = 742,
  Subsd = 743,
  Subss = 744,
  Swapgs = 745,
  Syscall = 746,
  Sysenter = 747,
  Sysexit = 748,
  Sysret = 749,
  T1mskc = 750,
  Test = 751,
  Tpause = 752,
  Tzcnt = 753,
  Tzmsk = 754,
  Ucomisd = 755,
  Ucomiss = 756,
  Ud0 = 757,
  Ud1 = 758,
  Ud2 = 759,
  Umonitor = 760,
  Umov = 761,
  Umwait = 762,
  Unpckhpd = 763,
  Unpckhps = 764,
  Unpcklpd = 765,
  Unpcklps = 766,
  V4fmaddps = 767,
  V4fmaddss = 768,
  V4fnmaddps = 769,
  V4fnmaddss = 770,
  Vaddpd = 771,
  Vaddps = 772,
  Vaddsd = 773,
  Vaddss = 774,
  Vaddsubpd = 775,
  Vaddsubps = 776,
  Vaesdec = 777,
  Vaesdeclast = 778,
  Vaesenc = 779,
  Vaesenclast = 780,
  Vaesimc = 781,
  Vaeskeygenassist = 782,
  Valignd = 783,
  Valignq = 784,
  Vandnpd = 785,
  Vandnps = 786,
  Vandpd = 787,
  Vandps = 788,
  Vblendmpd = 789,
  Vblendmps = 790,
  Vblendpd = 791,
  Vblendps = 792,
  Vblendvpd = 793,
  Vblendvps = 794,
  Vbroadcastf128 = 795,
  Vbroadcastf32x2 = 796,
  Vbroadcastf32x4 = 797,
  Vbroadcastf32x8 = 798,
  Vbroadcastf64x2 = 799,
  Vbroadcastf64x4 = 800,
  Vbroadcasti128 = 801,
  Vbroadcasti32x2 = 802,
  Vbroadcasti32x4 = 803,
  Vbroadcasti32x8 = 804,
  Vbroadcasti64x2 = 805,
  Vbroadcasti64x4 = 806,
  Vbroadcastsd = 807,
  Vbroadcastss = 808,
  Vcmppd = 809,
  Vcmpps = 810,
  Vcmpsd = 811,
  Vcmpss = 812,
  Vcomisd = 813,
  Vcomiss = 814,
  Vcompresspd = 815,
  Vcompressps = 816,
  Vcvtdq2pd = 817,
  Vcvtdq2ps = 818,
  Vcvtne2ps2bf16 = 819,
  Vcvtneps2bf16 = 820,
  Vcvtpd2dq = 821,
  Vcvtpd2ps = 822,
  Vcvtpd2qq = 823,
  Vcvtpd2udq = 824,
  Vcvtpd2uqq = 825,
  Vcvtph2ps = 826,
  Vcvtps2dq = 827,
  Vcvtps2pd = 828,
  Vcvtps2ph = 829,
  Vcvtps2qq = 830,
  Vcvtps2udq = 831,
  Vcvtps2uqq = 832,
  Vcvtqq2pd = 833,
  Vcvtqq2ps = 834,
  Vcvtsd2si = 835,
  Vcvtsd2ss = 836,
  Vcvtsd2usi = 837,
  Vcvtsi2sd = 838,
  Vcvtsi2ss = 839,
  Vcvtss2sd = 840,
  Vcvtss2si = 841,
  Vcvtss2usi = 842,
  Vcvttpd2dq = 843,
  Vcvttpd2qq = 844,
  Vcvttpd2udq = 845,
  Vcvttpd2uqq = 846,
  Vcvttps2dq = 847,
  Vcvttps2qq = 848,
  Vcvttps2udq = 849,
  Vcvttps2uqq = 850,
  Vcvttsd2si = 851,
  Vcvttsd2usi = 852,
  Vcvttss2si = 853,
  Vcvttss2usi = 854,
  Vcvtudq2pd = 855,
  Vcvtudq2ps = 856,
  Vcvtuqq2pd = 857,
  Vcvtuqq2ps = 858,
  Vcvtusi2sd = 859,
  Vcvtusi2ss = 860,
  Vdbpsadbw = 861,
  Vdivpd = 862,
  Vdivps = 863,
  Vdivsd = 864,
  Vdivss = 865,
  Vdpbf16ps = 866,
  Vdppd = 867,
  Vdpps = 868,
  Verr = 869,
  Verw = 870,
  Vexp2pd = 871,
  Vexp2ps = 872,
  Vexpandpd = 873,
  Vexpandps = 874,
  Vextractf128 = 875,
  Vextractf32x4 = 876,
  Vextractf32x8 = 877,
  Vextractf64x2 = 878,
  Vextractf64x4 = 879,
  Vextracti128 = 880,
  Vextracti32x4 = 881,
  Vextracti32x8 = 882,
  Vextracti64x2 = 883,
  Vextracti64x4 = 884,
  Vextractps = 885,
  Vfixupimmpd = 886,
  Vfixupimmps = 887,
  Vfixupimmsd = 888,
  Vfixupimmss = 889,
  Vfmadd132pd = 890,
  Vfmadd132ps = 891,
  Vfmadd132sd = 892,
  Vfmadd132ss = 893,
  Vfmadd213pd = 894,
  Vfmadd213ps = 895,
  Vfmadd213sd = 896,
  Vfmadd213ss = 897,
  Vfmadd231pd = 898,
  Vfmadd231ps = 899,
  Vfmadd231sd = 900,
  Vfmadd231ss = 901,
  Vfmaddpd = 902,
  Vfmaddps = 903,
  Vfmaddsd = 904,
  Vfmaddss = 905,
  Vfmaddsub132pd = 906,
  Vfmaddsub132ps = 907,
  Vfmaddsub213pd = 908,
  Vfmaddsub213ps = 909,
  Vfmaddsub231pd = 910,
  Vfmaddsub231ps = 911,
  Vfmaddsubpd = 912,
  Vfmaddsubps = 913,
  Vfmsub132pd = 914,
  Vfmsub132ps = 915,
  Vfmsub132sd = 916,
  Vfmsub132ss = 917,
  Vfmsub213pd = 918,
  Vfmsub213ps = 919,
  Vfmsub213sd = 920,
  Vfmsub213ss = 921,
  Vfmsub231pd = 922,
  Vfmsub231ps = 923,
  Vfmsub231sd = 924,
  Vfmsub231ss = 925,
  Vfmsubadd132pd = 926,
  Vfmsubadd132ps = 927,
  Vfmsubadd213pd = 928,
  Vfmsubadd213ps = 929,
  Vfmsubadd231pd = 930,
  Vfmsubadd231ps = 931,
  Vfmsubaddpd = 932,
  Vfmsubaddps = 933,
  Vfmsubpd = 934,
  Vfmsubps = 935,
  Vfmsubsd = 936,
  Vfmsubss = 937,
  Vfnmadd132pd = 938,
  Vfnmadd132ps = 939,
  Vfnmadd132sd = 940,
  Vfnmadd132ss = 941,
  Vfnmadd213pd = 942,
  Vfnmadd213ps = 943,
  Vfnmadd213sd = 944,
  Vfnmadd213ss = 945,
  Vfnmadd231pd = 946,
  Vfnmadd231ps = 947,
  Vfnmadd231sd = 948,
  Vfnmadd231ss = 949,
  Vfnmaddpd = 950,
  Vfnmaddps = 951,
  Vfnmaddsd = 952,
  Vfnmaddss = 953,
  Vfnmsub132pd = 954,
  Vfnmsub132ps = 955,
  Vfnmsub132sd = 956,
  Vfnmsub132ss = 957,
  Vfnmsub213pd = 958,
  Vfnmsub213ps = 959,
  Vfnmsub213sd = 960,
  Vfnmsub213ss = 961,
  Vfnmsub231pd = 962,
  Vfnmsub231ps = 963,
  Vfnmsub231sd = 964,
  Vfnmsub231ss = 965,
  Vfnmsubpd = 966,
  Vfnmsubps = 967,
  Vfnmsubsd = 968,
  Vfnmsubss = 969,
  Vfpclasspd = 970,
  Vfpclassps = 971,
  Vfpclasssd = 972,
  Vfpclassss = 973,
  Vfrczpd = 974,
  Vfrczps = 975,
  Vfrczsd = 976,
  Vfrczss = 977,
  Vgatherdpd = 978,
  Vgatherdps = 979,
  Vgatherpf0dpd = 980,
  Vgatherpf0dps = 981,
  Vgatherpf0qpd = 982,
  Vgatherpf0qps = 983,
  Vgatherpf1dpd = 984,
  Vgatherpf1dps = 985,
  Vgatherpf1qpd = 986,
  Vgatherpf1qps = 987,
  Vgatherqpd = 988,
  Vgatherqps = 989,
  Vgetexppd = 990,
  Vgetexpps = 991,
  Vgetexpsd = 992,
  Vgetexpss = 993,
  Vgetmantpd = 994,
  Vgetmantps = 995,
  Vgetmantsd = 996,
  Vgetmantss = 997,
  Vgf2p8affineinvqb = 998,
  Vgf2p8affineqb = 999,
  Vgf2p8mulb = 1000,
  Vhaddpd = 1001,
  Vhaddps = 1002,
  Vhsubpd = 1003,
  Vhsubps = 1004,
  Vinsertf128 = 1005,
  Vinsertf32x4 = 1006,
  Vinsertf32x8 = 1007,
  Vinsertf64x2 = 1008,
  Vinsertf64x4 = 1009,
  Vinserti128 = 1010,
  Vinserti32x4 = 1011,
  Vinserti32x8 = 1012,
  Vinserti64x2 = 1013,
  Vinserti64x4 = 1014,
  Vinsertps = 1015,
  Vlddqu = 1016,
  Vldmxcsr = 1017,
  Vmaskmovdqu = 1018,
  Vmaskmovpd = 1019,
  Vmaskmovps = 1020,
  Vmaxpd = 1021,
  Vmaxps = 1022,
  Vmaxsd = 1023,
  Vmaxss = 1024,
  Vmcall = 1025,
  Vmclear = 1026,
  Vmfunc = 1027,
  Vminpd = 1028,
  Vminps = 1029,
  Vminsd = 1030,
  Vminss = 1031,
  Vmlaunch = 1032,
  Vmload = 1033,
  Vmmcall = 1034,
  Vmovapd = 1035,
  Vmovaps = 1036,
  Vmovd = 1037,
  Vmovddup = 1038,
  Vmovdqa = 1039,
  Vmovdqa32 = 1040,
  Vmovdqa64 = 1041,
  Vmovdqu = 1042,
  Vmovdqu16 = 1043,
  Vmovdqu32 = 1044,
  Vmovdqu64 = 1045,
  Vmovdqu8 = 1046,
  Vmovhlps = 1047,
  Vmovhpd = 1048,
  Vmovhps = 1049,
  Vmovlhps = 1050,
  Vmovlpd = 1051,
  Vmovlps = 1052,
  Vmovmskpd = 1053,
  Vmovmskps = 1054,
  Vmovntdq = 1055,
  Vmovntdqa = 1056,
  Vmovntpd = 1057,
  Vmovntps = 1058,
  Vmovq = 1059,
  Vmovsd = 1060,
  Vmovshdup = 1061,
  Vmovsldup = 1062,
  Vmovss = 1063,
  Vmovupd = 1064,
  Vmovups = 1065,
  Vmpsadbw = 1066,
  Vmptrld = 1067,
  Vmptrst = 1068,
  Vmread = 1069,
  Vmresume = 1070,
  Vmrun = 1071,
  Vmsave = 1072,
  Vmulpd = 1073,
  Vmulps = 1074,
  Vmulsd = 1075,
  Vmulss = 1076,
  Vmwrite = 1077,
  Vmxoff = 1078,
  Vmxon = 1079,
  Vorpd = 1080,
  Vorps = 1081,
  Vp2intersectd = 1082,
  Vp2intersectq = 1083,
  Vp4dpwssd = 1084,
  Vp4dpwssds = 1085,
  Vpabsb = 1086,
  Vpabsd = 1087,
  Vpabsq = 1088,
  Vpabsw = 1089,
  Vpackssdw = 1090,
  Vpacksswb = 1091,
  Vpackusdw = 1092,
  Vpackuswb = 1093,
  Vpaddb = 1094,
  Vpaddd = 1095,
  Vpaddq = 1096,
  Vpaddsb = 1097,
  Vpaddsw = 1098,
  Vpaddusb = 1099,
  Vpaddusw = 1100,
  Vpaddw = 1101,
  Vpalignr = 1102,
  Vpand = 1103,
  Vpandd = 1104,
  Vpandn = 1105,
  Vpandnd = 1106,
  Vpandnq = 1107,
  Vpandq = 1108,
  Vpavgb = 1109,
  Vpavgw = 1110,
  Vpblendd = 1111,
  Vpblendmb = 1112,
  Vpblendmd = 1113,
  Vpblendmq = 1114,
  Vpblendmw = 1115,
  Vpblendvb = 1116,
  Vpblendw = 1117,
  Vpbroadcastb = 1118,
  Vpbroadcastd = 1119,
  Vpbroadcastmb2q = 1120,
  Vpbroadcastmw2d = 1121,
  Vpbroadcastq = 1122,
  Vpbroadcastw = 1123,
  Vpclmulqdq = 1124,
  Vpcmov = 1125,
  Vpcmpb = 1126,
  Vpcmpd = 1127,
  Vpcmpeqb = 1128,
  Vpcmpeqd = 1129,
  Vpcmpeqq = 1130,
  Vpcmpeqw = 1131,
  Vpcmpestri = 1132,
  Vpcmpestri64 = 1133,
  Vpcmpestrm = 1134,
  Vpcmpestrm64 = 1135,
  Vpcmpgtb = 1136,
  Vpcmpgtd = 1137,
  Vpcmpgtq = 1138,
  Vpcmpgtw = 1139,
  Vpcmpistri = 1140,
  Vpcmpistrm = 1141,
  Vpcmpq = 1142,
  Vpcmpub = 1143,
  Vpcmpud = 1144,
  Vpcmpuq = 1145,
  Vpcmpuw = 1146,
  Vpcmpw = 1147,
  Vpcomb = 1148,
  Vpcomd = 1149,
  Vpcompressb = 1150,
  Vpcompressd = 1151,
  Vpcompressq = 1152,
  Vpcompressw = 1153,
  Vpcomq = 1154,
  Vpcomub = 1155,
  Vpcomud = 1156,
  Vpcomuq = 1157,
  Vpcomuw = 1158,
  Vpcomw = 1159,
  Vpconflictd = 1160,
  Vpconflictq = 1161,
  Vpdpbusd = 1162,
  Vpdpbusds = 1163,
  Vpdpwssd = 1164,
  Vpdpwssds = 1165,
  Vperm2f128 = 1166,
  Vperm2i128 = 1167,
  Vpermb = 1168,
  Vpermd = 1169,
  Vpermi2b = 1170,
  Vpermi2d = 1171,
  Vpermi2pd = 1172,
  Vpermi2ps = 1173,
  Vpermi2q = 1174,
  Vpermi2w = 1175,
  Vpermil2pd = 1176,
  Vpermil2ps = 1177,
  Vpermilpd = 1178,
  Vpermilps = 1179,
  Vpermpd = 1180,
  Vpermps = 1181,
  Vpermq = 1182,
  Vpermt2b = 1183,
  Vpermt2d = 1184,
  Vpermt2pd = 1185,
  Vpermt2ps = 1186,
  Vpermt2q = 1187,
  Vpermt2w = 1188,
  Vpermw = 1189,
  Vpexpandb = 1190,
  Vpexpandd = 1191,
  Vpexpandq = 1192,
  Vpexpandw = 1193,
  Vpextrb = 1194,
  Vpextrd = 1195,
  Vpextrq = 1196,
  Vpextrw = 1197,
  Vpgatherdd = 1198,
  Vpgatherdq = 1199,
  Vpgatherqd = 1200,
  Vpgatherqq = 1201,
  Vphaddbd = 1202,
  Vphaddbq = 1203,
  Vphaddbw = 1204,
  Vphaddd = 1205,
  Vphadddq = 1206,
  Vphaddsw = 1207,
  Vphaddubd = 1208,
  Vphaddubq = 1209,
  Vphaddubw = 1210,
  Vphaddudq = 1211,
  Vphadduwd = 1212,
  Vphadduwq = 1213,
  Vphaddw = 1214,
  Vphaddwd = 1215,
  Vphaddwq = 1216,
  Vphminposuw = 1217,
  Vphsubbw = 1218,
  Vphsubd = 1219,
  Vphsubdq = 1220,
  Vphsubsw = 1221,
  Vphsubw = 1222,
  Vphsubwd = 1223,
  Vpinsrb = 1224,
  Vpinsrd = 1225,
  Vpinsrq = 1226,
  Vpinsrw = 1227,
  Vplzcntd = 1228,
  Vplzcntq = 1229,
  Vpmacsdd = 1230,
  Vpmacsdqh = 1231,
  Vpmacsdql = 1232,
  Vpmacssdd = 1233,
  Vpmacssdqh = 1234,
  Vpmacssdql = 1235,
  Vpmacsswd = 1236,
  Vpmacssww = 1237,
  Vpmacswd = 1238,
  Vpmacsww = 1239,
  Vpmadcsswd = 1240,
  Vpmadcswd = 1241,
  Vpmadd52huq = 1242,
  Vpmadd52luq = 1243,
  Vpmaddubsw = 1244,
  Vpmaddwd = 1245,
  Vpmaskmovd = 1246,
  Vpmaskmovq = 1247,
  Vpmaxsb = 1248,
  Vpmaxsd = 1249,
  Vpmaxsq = 1250,
  Vpmaxsw = 1251,
  Vpmaxub = 1252,
  Vpmaxud = 1253,
  Vpmaxuq = 1254,
  Vpmaxuw = 1255,
  Vpminsb = 1256,
  Vpminsd = 1257,
  Vpminsq = 1258,
  Vpminsw = 1259,
  Vpminub = 1260,
  Vpminud = 1261,
  Vpminuq = 1262,
  Vpminuw = 1263,
  Vpmovb2m = 1264,
  Vpmovd2m = 1265,
  Vpmovdb = 1266,
  Vpmovdw = 1267,
  Vpmovm2b = 1268,
  Vpmovm2d = 1269,
  Vpmovm2q = 1270,
  Vpmovm2w = 1271,
  Vpmovmskb = 1272,
  Vpmovq2m = 1273,
  Vpmovqb = 1274,
  Vpmovqd = 1275,
  Vpmovqw = 1276,
  Vpmovsdb = 1277,
  Vpmovsdw = 1278,
  Vpmovsqb = 1279,
  Vpmovsqd = 1280,
  Vpmovsqw = 1281,
  Vpmovswb = 1282,
  Vpmovsxbd = 1283,
  Vpmovsxbq = 1284,
  Vpmovsxbw = 1285,
  Vpmovsxdq = 1286,
  Vpmovsxwd = 1287,
  Vpmovsxwq = 1288,
  Vpmovusdb = 1289,
  Vpmovusdw = 1290,
  Vpmovusqb = 1291,
  Vpmovusqd = 1292,
  Vpmovusqw = 1293,
  Vpmovuswb = 1294,
  Vpmovw2m = 1295,
  Vpmovwb = 1296,
  Vpmovzxbd = 1297,
  Vpmovzxbq = 1298,
  Vpmovzxbw = 1299,
  Vpmovzxdq = 1300,
  Vpmovzxwd = 1301,
  Vpmovzxwq = 1302,
  Vpmuldq = 1303,
  Vpmulhrsw = 1304,
  Vpmulhuw = 1305,
  Vpmulhw = 1306,
  Vpmulld = 1307,
  Vpmullq = 1308,
  Vpmullw = 1309,
  Vpmultishiftqb = 1310,
  Vpmuludq = 1311,
  Vpopcntb = 1312,
  Vpopcntd = 1313,
  Vpopcntq = 1314,
  Vpopcntw = 1315,
  Vpor = 1316,
  Vpord = 1317,
  Vporq = 1318,
  Vpperm = 1319,
  Vprold = 1320,
  Vprolq = 1321,
  Vprolvd = 1322,
  Vprolvq = 1323,
  Vprord = 1324,
  Vprorq = 1325,
  Vprorvd = 1326,
  Vprorvq = 1327,
  Vprotb = 1328,
  Vprotd = 1329,
  Vprotq = 1330,
  Vprotw = 1331,
  Vpsadbw = 1332,
  Vpscatterdd = 1333,
  Vpscatterdq = 1334,
  Vpscatterqd = 1335,
  Vpscatterqq = 1336,
  Vpshab = 1337,
  Vpshad = 1338,
  Vpshaq = 1339,
  Vpshaw = 1340,
  Vpshlb = 1341,
  Vpshld = 1342,
  Vpshldd = 1343,
  Vpshldq = 1344,
  Vpshldvd = 1345,
  Vpshldvq = 1346,
  Vpshldvw = 1347,
  Vpshldw = 1348,
  Vpshlq = 1349,
  Vpshlw = 1350,
  Vpshrdd = 1351,
  Vpshrdq = 1352,
  Vpshrdvd = 1353,
  Vpshrdvq = 1354,
  Vpshrdvw = 1355,
  Vpshrdw = 1356,
  Vpshufb = 1357,
  Vpshufbitqmb = 1358,
  Vpshufd = 1359,
  Vpshufhw = 1360,
  Vpshuflw = 1361,
  Vpsignb = 1362,
  Vpsignd = 1363,
  Vpsignw = 1364,
  Vpslld = 1365,
  Vpslldq = 1366,
  Vpsllq = 1367,
  Vpsllvd = 1368,
  Vpsllvq = 1369,
  Vpsllvw = 1370,
  Vpsllw = 1371,
  Vpsrad = 1372,
  Vpsraq = 1373,
  Vpsravd = 1374,
  Vpsravq = 1375,
  Vpsravw = 1376,
  Vpsraw = 1377,
  Vpsrld = 1378,
  Vpsrldq = 1379,
  Vpsrlq = 1380,
  Vpsrlvd = 1381,
  Vpsrlvq = 1382,
  Vpsrlvw = 1383,
  Vpsrlw = 1384,
  Vpsubb = 1385,
  Vpsubd = 1386,
  Vpsubq = 1387,
  Vpsubsb = 1388,
  Vpsubsw = 1389,
  Vpsubusb = 1390,
  Vpsubusw = 1391,
  Vpsubw = 1392,
  Vpternlogd = 1393,
  Vpternlogq = 1394,
  Vptest = 1395,
  Vptestmb = 1396,
  Vptestmd = 1397,
  Vptestmq = 1398,
  Vptestmw = 1399,
  Vptestnmb = 1400,
  Vptestnmd = 1401,
  Vptestnmq = 1402,
  Vptestnmw = 1403,
  Vpunpckhbw = 1404,
  Vpunpckhdq = 1405,
  Vpunpckhqdq = 1406,
  Vpunpckhwd = 1407,
  Vpunpcklbw = 1408,
  Vpunpckldq = 1409,
  Vpunpcklqdq = 1410,
  Vpunpcklwd = 1411,
  Vpxor = 1412,
  Vpxord = 1413,
  Vpxorq = 1414,
  Vrangepd = 1415,
  Vrangeps = 1416,
  Vrangesd = 1417,
  Vrangess = 1418,
  Vrcp14pd = 1419,
  Vrcp14ps = 1420,
  Vrcp14sd = 1421,
  Vrcp14ss = 1422,
  Vrcp28pd = 1423,
  Vrcp28ps = 1424,
  Vrcp28sd = 1425,
  Vrcp28ss = 1426,
  Vrcpps = 1427,
  Vrcpss = 1428,
  Vreducepd = 1429,
  Vreduceps = 1430,
  Vreducesd = 1431,
  Vreducess = 1432,
  Vrndscalepd = 1433,
  Vrndscaleps = 1434,
  Vrndscalesd = 1435,
  Vrndscaless = 1436,
  Vroundpd = 1437,
  Vroundps = 1438,
  Vroundsd = 1439,
  Vroundss = 1440,
  Vrsqrt14pd = 1441,
  Vrsqrt14ps = 1442,
  Vrsqrt14sd = 1443,
  Vrsqrt14ss = 1444,
  Vrsqrt28pd = 1445,
  Vrsqrt28ps = 1446,
  Vrsqrt28sd = 1447,
  Vrsqrt28ss = 1448,
  Vrsqrtps = 1449,
  Vrsqrtss = 1450,
  Vscalefpd = 1451,
  Vscalefps = 1452,
  Vscalefsd = 1453,
  Vscalefss = 1454,
  Vscatterdpd = 1455,
  Vscatterdps = 1456,
  Vscatterpf0dpd = 1457,
  Vscatterpf0dps = 1458,
  Vscatterpf0qpd = 1459,
  Vscatterpf0qps = 1460,
  Vscatterpf1dpd = 1461,
  Vscatterpf1dps = 1462,
  Vscatterpf1qpd = 1463,
  Vscatterpf1qps = 1464,
  Vscatterqpd = 1465,
  Vscatterqps = 1466,
  Vshuff32x4 = 1467,
  Vshuff64x2 = 1468,
  Vshufi32x4 = 1469,
  Vshufi64x2 = 1470,
  Vshufpd = 1471,
  Vshufps = 1472,
  Vsqrtpd = 1473,
  Vsqrtps = 1474,
  Vsqrtsd = 1475,
  Vsqrtss = 1476,
  Vstmxcsr = 1477,
  Vsubpd = 1478,
  Vsubps = 1479,
  Vsubsd = 1480,
  Vsubss = 1481,
  Vtestpd = 1482,
  Vtestps = 1483,
  Vucomisd = 1484,
  Vucomiss = 1485,
  Vunpckhpd = 1486,
  Vunpckhps = 1487,
  Vunpcklpd = 1488,
  Vunpcklps = 1489,
  Vxorpd = 1490,
  Vxorps = 1491,
  Vzeroall = 1492,
  Vzeroupper = 1493,
  Wait = 1494,
  Wbinvd = 1495,
  Wbnoinvd = 1496,
  Wrfsbase = 1497,
  Wrgsbase = 1498,
  Wrmsr = 1499,
  Wrpkru = 1500,
  Wrssd = 1501,
  Wrssq = 1502,
  Wrussd = 1503,
  Wrussq = 1504,
  Xabort = 1505,
  Xadd = 1506,
  Xbegin = 1507,
  Xbts = 1508,
  Xchg = 1509,
  Xcryptcbc = 1510,
  Xcryptcfb = 1511,
  Xcryptctr = 1512,
  Xcryptecb = 1513,
  Xcryptofb = 1514,
  Xend = 1515,
  Xgetbv = 1516,
  Xlatb = 1517,
  Xor = 1518,
  Xorpd = 1519,
  Xorps = 1520,
  Xrstor = 1521,
  Xrstor64 = 1522,
  Xrstors = 1523,
  Xrstors64 = 1524,
  Xsave = 1525,
  Xsave64 = 1526,
  Xsavec = 1527,
  Xsavec64 = 1528,
  Xsaveopt = 1529,
  Xsaveopt64 = 1530,
  Xsaves = 1531,
  Xsaves64 = 1532,
  Xsetbv = 1533,
  Xsha1 = 1534,
  Xsha256 = 1535,
  Xstore = 1536,
  Xtest = 1537,
  Rmpadjust = 1538,
  Rmpupdate = 1539,
  Psmash = 1540,
  Pvalidate = 1541,
  Serialize = 1542,
  Xsusldtrk = 1543,
  Xresldtrk = 1544,
  Invlpgb = 1545,
  Tlbsync = 1546,
  Vmgexit = 1547,
  Getsecq = 1548,
  Sysexitq = 1549,
  Ldtilecfg = 1550,
  Tilerelease = 1551,
  Sttilecfg = 1552,
  Tilezero = 1553,
  Tileloaddt1 = 1554,
  Tilestored = 1555,
  Tileloadd = 1556,
  Tdpbf16ps = 1557,
  Tdpbuud = 1558,
  Tdpbusd = 1559,
  Tdpbsud = 1560,
  Tdpbssd = 1561,
  Sysretq = 1562,
  Fnstdw = 1563,
  Fnstsg = 1564,
  Rdshr = 1565,
  Wrshr = 1566,
  Smint = 1567,
  Dmint = 1568,
  Rdm = 1569,
  Svdc = 1570,
  Rsdc = 1571,
  Svldt = 1572,
  Rsldt = 1573,
  Svts = 1574,
  Rsts = 1575,
  Bb0_reset = 1576,
  Bb1_reset = 1577,
  Cpu_write = 1578,
  Cpu_read = 1579,
  Altinst = 1580,
  Paveb = 1581,
  Paddsiw = 1582,
  Pmagw = 1583,
  Pdistib = 1584,
  Psubsiw = 1585,
  Pmvzb = 1586,
  Pmvnzb = 1587,
  Pmvlzb = 1588,
  Pmvgezb = 1589,
  Pmulhriw = 1590,
  Pmachriw = 1591,
  Ftstp = 1592,
  Frint2 = 1593,
  Frichop = 1594,
  Frinear = 1595,
  Undoc = 1596,
  Tdcall = 1597,
  Seamret = 1598,
  Seamops = 1599,
  Seamcall = 1600,
  Aesencwide128kl = 1601,
  Aesdecwide128kl = 1602,
  Aesencwide256kl = 1603,
  Aesdecwide256kl = 1604,
  Loadiwkey = 1605,
  Aesenc128kl = 1606,
  Aesdec128kl = 1607,
  Aesenc256kl = 1608,
  Aesdec256kl = 1609,
  Encodekey128 = 1610,
  Encodekey256 = 1611,
  Pushad = 1612,
  Popad = 1613,
  Pushfd = 1614,
  Pushfq = 1615,
  Popfd = 1616,
  Popfq = 1617,
  Iretd = 1618,
  Iretq = 1619,
  Int3 = 1620,
  Uiret = 1621,
  Testui = 1622,
  Clui = 1623,
  Stui = 1624,
  Senduipi = 1625,
  Hreset = 1626,
  Ccs_hash = 1627,
  Ccs_encrypt = 1628,
  Lkgs = 1629,
  Eretu = 1630,
  Erets = 1631,
  Storeall = 1632,
  Vaddph = 1633,
  Vaddsh = 1634,
  Vcmpph = 1635,
  Vcmpsh = 1636,
  Vcomish = 1637,
  Vcvtdq2ph = 1638,
  Vcvtpd2ph = 1639,
  Vcvtph2dq = 1640,
  Vcvtph2pd = 1641,
  Vcvtph2psx = 1642,
  Vcvtph2qq = 1643,
  Vcvtph2udq = 1644,
  Vcvtph2uqq = 1645,
  Vcvtph2uw = 1646,
  Vcvtph2w = 1647,
  Vcvtps2phx = 1648,
  Vcvtqq2ph = 1649,
  Vcvtsd2sh = 1650,
  Vcvtsh2sd = 1651,
  Vcvtsh2si = 1652,
  Vcvtsh2ss = 1653,
  Vcvtsh2usi = 1654,
  Vcvtsi2sh = 1655,
  Vcvtss2sh = 1656,
  Vcvttph2dq = 1657,
  Vcvttph2qq = 1658,
  Vcvttph2udq = 1659,
  Vcvttph2uqq = 1660,
  Vcvttph2uw = 1661,
  Vcvttph2w = 1662,
  Vcvttsh2si = 1663,
  Vcvttsh2usi = 1664,
  Vcvtudq2ph = 1665,
  Vcvtuqq2ph = 1666,
  Vcvtusi2sh = 1667,
  Vcvtuw2ph = 1668,
  Vcvtw2ph = 1669,
  Vdivph = 1670,
  Vdivsh = 1671,
  Vfcmaddcph = 1672,
  Vfmaddcph = 1673,
  Vfcmaddcsh = 1674,
  Vfmaddcsh = 1675,
  Vfcmulcph = 1676,
  Vfmulcph = 1677,
  Vfcmulcsh = 1678,
  Vfmulcsh = 1679,
  Vfmaddsub132ph = 1680,
  Vfmaddsub213ph = 1681,
  Vfmaddsub231ph = 1682,
  Vfmsubadd132ph = 1683,
  Vfmsubadd213ph = 1684,
  Vfmsubadd231ph = 1685,
  Vfmadd132ph = 1686,
  Vfmadd213ph = 1687,
  Vfmadd231ph = 1688,
  Vfnmadd132ph = 1689,
  Vfnmadd213ph = 1690,
  Vfnmadd231ph = 1691,
  Vfmadd132sh = 1692,
  Vfmadd213sh = 1693,
  Vfmadd231sh = 1694,
  Vfnmadd132sh = 1695,
  Vfnmadd213sh = 1696,
  Vfnmadd231sh = 1697,
  Vfmsub132ph = 1698,
  Vfmsub213ph = 1699,
  Vfmsub231ph = 1700,
  Vfnmsub132ph = 1701,
  Vfnmsub213ph = 1702,
  Vfnmsub231ph = 1703,
  Vfmsub132sh = 1704,
  Vfmsub213sh = 1705,
  Vfmsub231sh = 1706,
  Vfnmsub132sh = 1707,
  Vfnmsub213sh = 1708,
  Vfnmsub231sh = 1709,
  Vfpclassph = 1710,
  Vfpclasssh = 1711,
  Vgetexpph = 1712,
  Vgetexpsh = 1713,
  Vgetmantph = 1714,
  Vgetmantsh = 1715,
  Vmaxph = 1716,
  Vmaxsh = 1717,
  Vminph = 1718,
  Vminsh = 1719,
  Vmovsh = 1720,
  Vmovw = 1721,
  Vmulph = 1722,
  Vmulsh = 1723,
  Vrcpph = 1724,
  Vrcpsh = 1725,
  Vreduceph = 1726,
  Vreducesh = 1727,
  Vrndscaleph = 1728,
  Vrndscalesh = 1729,
  Vrsqrtph = 1730,
  Vrsqrtsh = 1731,
  Vscalefph = 1732,
  Vscalefsh = 1733,
  Vsqrtph = 1734,
  Vsqrtsh = 1735,
  Vsubph = 1736,
  Vsubsh = 1737,
  Vucomish = 1738,
  Rdudbg = 1739,
  Wrudbg = 1740,
  Clevict0 = 1741,
  Clevict1 = 1742,
  Delay = 1743,
  Jknzd = 1744,
  Jkzd = 1745,
  Kand = 1746,
  Kandn = 1747,
  Kandnr = 1748,
  Kconcath = 1749,
  Kconcatl = 1750,
  Kextract = 1751,
  Kmerge2l1h = 1752,
  Kmerge2l1l = 1753,
  Kmov = 1754,
  Knot = 1755,
  Kor = 1756,
  Kortest = 1757,
  Kxnor = 1758,
  Kxor = 1759,
  Spflt = 1760,
  Tzcnti = 1761,
  Vaddnpd = 1762,
  Vaddnps = 1763,
  Vaddsetsps = 1764,
  Vcvtfxpntdq2ps = 1765,
  Vcvtfxpntpd2dq = 1766,
  Vcvtfxpntpd2udq = 1767,
  Vcvtfxpntps2dq = 1768,
  Vcvtfxpntps2udq = 1769,
  Vcvtfxpntudq2ps = 1770,
  Vexp223ps = 1771,
  Vfixupnanpd = 1772,
  Vfixupnanps = 1773,
  Vfmadd233ps = 1774,
  Vgatherpf0hintdpd = 1775,
  Vgatherpf0hintdps = 1776,
  Vgmaxabsps = 1777,
  Vgmaxpd = 1778,
  Vgmaxps = 1779,
  Vgminpd = 1780,
  Vgminps = 1781,
  Vloadunpackhd = 1782,
  Vloadunpackhpd = 1783,
  Vloadunpackhps = 1784,
  Vloadunpackhq = 1785,
  Vloadunpackld = 1786,
  Vloadunpacklpd = 1787,
  Vloadunpacklps = 1788,
  Vloadunpacklq = 1789,
  Vlog2ps = 1790,
  Vmovnrapd = 1791,
  Vmovnraps = 1792,
  Vmovnrngoapd = 1793,
  Vmovnrngoaps = 1794,
  Vpackstorehd = 1795,
  Vpackstorehpd = 1796,
  Vpackstorehps = 1797,
  Vpackstorehq = 1798,
  Vpackstoreld = 1799,
  Vpackstorelpd = 1800,
  Vpackstorelps = 1801,
  Vpackstorelq = 1802,
  Vpadcd = 1803,
  Vpaddsetcd = 1804,
  Vpaddsetsd = 1805,
  Vpcmpltd = 1806,
  Vpermf32x4 = 1807,
  Vpmadd231d = 1808,
  Vpmadd233d = 1809,
  Vpmulhd = 1810,
  Vpmulhud = 1811,
  Vprefetch0 = 1812,
  Vprefetch1 = 1813,
  Vprefetch2 = 1814,
  Vprefetche0 = 1815,
  Vprefetche1 = 1816,
  Vprefetche2 = 1817,
  Vprefetchenta = 1818,
  Vprefetchnta = 1819,
  Vpsbbd = 1820,
  Vpsbbrd = 1821,
  Vpsubrd = 1822,
  Vpsubrsetbd = 1823,
  Vpsubsetbd = 1824,
  Vrcp23ps = 1825,
  Vrndfxpntpd = 1826,
  Vrndfxpntps = 1827,
  Vrsqrt23ps = 1828,
  Vscaleps = 1829,
  Vscatterpf0hintdpd = 1830,
  Vscatterpf0hintdps = 1831,
  Vsubrpd = 1832,
  Vsubrps = 1833,
  Xsha512 = 1834,
  Xstore_alt = 1835,
  Xsha512_alt = 1836,
  Zero_bytes = 1837,
  Aadd = 1838,
  Aand = 1839,
  Aor = 1840,
  Axor = 1841,
  Cmpbexadd = 1842,
  Cmpbxadd = 1843,
  Cmplexadd = 1844,
  Cmplxadd = 1845,
  Cmpnbexadd = 1846,
  Cmpnbxadd = 1847,
  Cmpnlexadd = 1848,
  Cmpnlxadd = 1849,
  Cmpnoxadd = 1850,
  Cmpnpxadd = 1851,
  Cmpnsxadd = 1852,
  Cmpnzxadd = 1853,
  Cmpoxadd = 1854,
  Cmppxadd = 1855,
  Cmpsxadd = 1856,
  Cmpzxadd = 1857,
  Prefetchit0 = 1858,
  Prefetchit1 = 1859,
  Rdmsrlist = 1860,
  Rmpquery = 1861,
  Tdpfp16ps = 1862,
  Vbcstnebf162ps = 1863,
  Vbcstnesh2ps = 1864,
  Vcvtneebf162ps = 1865,
  Vcvtneeph2ps = 1866,
  Vcvtneobf162ps = 1867,
  Vcvtneoph2ps = 1868,
  Vpdpbssd = 1869,
  Vpdpbssds = 1870,
  Vpdpbsud = 1871,
  Vpdpbsuds = 1872,
  Vpdpbuud = 1873,
  Vpdpbuuds = 1874,
  Wrmsrlist = 1875,
  Wrmsrns = 1876,
  Tcmmrlfp16ps = 1877,
  Tcmmimfp16ps = 1878,
  Pbndkb = 1879,
  Vpdpwsud = 1880,
  Vpdpwsuds = 1881,
  Vpdpwusd = 1882,
  Vpdpwusds = 1883,
  Vpdpwuud = 1884,
  Vpdpwuuds = 1885,
  Vsha512msg1 = 1886,
  Vsha512msg2 = 1887,
  Vsha512rnds2 = 1888,
  Vsm3msg1 = 1889,
  Vsm3msg2 = 1890,
  Vsm3rnds2 = 1891,
  Vsm4key4 = 1892,
  Vsm4rnds4 = 1893,
}
/**
* Mnemonic condition code selector (eg. `JE` / `JZ`)
*/
export enum CC_e {
/**
* `JE`, `CMOVE`, `SETE`, `LOOPE`, `REPE`
*/
  e = 0,
/**
* `JZ`, `CMOVZ`, `SETZ`, `LOOPZ`, `REPZ`
*/
  z = 1,
}
/**
* Decoder error
*/
export enum DecoderError {
/**
* No error. The last decoded instruction is a valid instruction
*/
  None = 0,
/**
* It's an invalid instruction or an invalid encoding of an existing instruction (eg. some reserved bit is set/cleared)
*/
  InvalidInstruction = 1,
/**
* There's not enough bytes left to decode the instruction
*/
  NoMoreBytes = 2,
}
/**
* Mnemonic condition code selector (eg. `JAE` / `JNB` / `JNC`)
*/
export enum CC_ae {
/**
* `JAE`, `CMOVAE`, `SETAE`
*/
  ae = 0,
/**
* `JNB`, `CMOVNB`, `SETNB`
*/
  nb = 1,
/**
* `JNC`, `CMOVNC`, `SETNC`
*/
  nc = 2,
}
/**
* Instruction condition code (used by `Jcc`, `SETcc`, `CMOVcc`, `CMPccXADD`, `LOOPcc`)
*/
export enum ConditionCode {
/**
* The instruction doesn't have a condition code
*/
  None = 0,
/**
* Overflow (`OF=1`)
*/
  o = 1,
/**
* Not overflow (`OF=0`)
*/
  no = 2,
/**
* Below (unsigned) (`CF=1`)
*/
  b = 3,
/**
* Above or equal (unsigned) (`CF=0`)
*/
  ae = 4,
/**
* Equal / zero (`ZF=1`)
*/
  e = 5,
/**
* Not equal / zero (`ZF=0`)
*/
  ne = 6,
/**
* Below or equal (unsigned) (`CF=1 or ZF=1`)
*/
  be = 7,
/**
* Above (unsigned) (`CF=0 and ZF=0`)
*/
  a = 8,
/**
* Signed (`SF=1`)
*/
  s = 9,
/**
* Not signed (`SF=0`)
*/
  ns = 10,
/**
* Parity (`PF=1`)
*/
  p = 11,
/**
* Not parity (`PF=0`)
*/
  np = 12,
/**
* Less (signed) (`SF!=OF`)
*/
  l = 13,
/**
* Greater than or equal (signed) (`SF=OF`)
*/
  ge = 14,
/**
* Less than or equal (signed) (`ZF=1 or SF!=OF`)
*/
  le = 15,
/**
* Greater (signed) (`ZF=0 and SF=OF`)
*/
  g = 16,
}
/**
* Format mnemonic options
*/
export enum FormatMnemonicOptions {
/**
* No option is set
*/
  None = 0,
/**
* Don't add any prefixes
*/
  NoPrefixes = 1,
/**
* Don't add the mnemonic
*/
  NoMnemonic = 2,
}
/**
* Operand kind
*/
export enum OpCodeOperandKind {
/**
* No operand
*/
  None = 0,
/**
* Far branch 16-bit offset, 16-bit segment/selector
*/
  farbr2_2 = 1,
/**
* Far branch 32-bit offset, 16-bit segment/selector
*/
  farbr4_2 = 2,
/**
* Memory offset without a modrm byte (eg. `MOV AL,[offset]`)
*/
  mem_offs = 3,
/**
* Memory (modrm)
*/
  mem = 4,
/**
* Memory (modrm), MPX:
*
* 16/32-bit mode: must be 32-bit addressing
*
* 64-bit mode: 64-bit addressing is forced and must not be RIP relative
*/
  mem_mpx = 5,
/**
* Memory (modrm), MPX:
*
* 16/32-bit mode: must be 32-bit addressing
*
* 64-bit mode: 64-bit addressing is forced and must not be RIP relative
*/
  mem_mib = 6,
/**
* Memory (modrm), vsib32, `XMM` registers
*/
  mem_vsib32x = 7,
/**
* Memory (modrm), vsib64, `XMM` registers
*/
  mem_vsib64x = 8,
/**
* Memory (modrm), vsib32, `YMM` registers
*/
  mem_vsib32y = 9,
/**
* Memory (modrm), vsib64, `YMM` registers
*/
  mem_vsib64y = 10,
/**
* Memory (modrm), vsib32, `ZMM` registers
*/
  mem_vsib32z = 11,
/**
* Memory (modrm), vsib64, `ZMM` registers
*/
  mem_vsib64z = 12,
/**
* 8-bit GPR or memory
*/
  r8_or_mem = 13,
/**
* 16-bit GPR or memory
*/
  r16_or_mem = 14,
/**
* 32-bit GPR or memory
*/
  r32_or_mem = 15,
/**
* 32-bit GPR or memory, MPX: 16/32-bit mode: must be 32-bit addressing, 64-bit mode: 64-bit addressing is forced
*/
  r32_or_mem_mpx = 16,
/**
* 64-bit GPR or memory
*/
  r64_or_mem = 17,
/**
* 64-bit GPR or memory, MPX: 16/32-bit mode: must be 32-bit addressing, 64-bit mode: 64-bit addressing is forced
*/
  r64_or_mem_mpx = 18,
/**
* `MM` register or memory
*/
  mm_or_mem = 19,
/**
* `XMM` register or memory
*/
  xmm_or_mem = 20,
/**
* `YMM` register or memory
*/
  ymm_or_mem = 21,
/**
* `ZMM` register or memory
*/
  zmm_or_mem = 22,
/**
* `BND` register or memory, MPX: 16/32-bit mode: must be 32-bit addressing, 64-bit mode: 64-bit addressing is forced
*/
  bnd_or_mem_mpx = 23,
/**
* `K` register or memory
*/
  k_or_mem = 24,
/**
* 8-bit GPR encoded in the `reg` field of the modrm byte
*/
  r8_reg = 25,
/**
* 8-bit GPR encoded in the low 3 bits of the opcode
*/
  r8_opcode = 26,
/**
* 16-bit GPR encoded in the `reg` field of the modrm byte
*/
  r16_reg = 27,
/**
* 16-bit GPR encoded in the `reg` field of the modrm byte. This is a memory operand and it uses the address size prefix (`67h`) not the operand size prefix (`66h`).
*/
  r16_reg_mem = 28,
/**
* 16-bit GPR encoded in the `mod + r/m` fields of the modrm byte
*/
  r16_rm = 29,
/**
* 16-bit GPR encoded in the low 3 bits of the opcode
*/
  r16_opcode = 30,
/**
* 32-bit GPR encoded in the `reg` field of the modrm byte
*/
  r32_reg = 31,
/**
* 32-bit GPR encoded in the `reg` field of the modrm byte. This is a memory operand and it uses the address size prefix (`67h`) not the operand size prefix (`66h`).
*/
  r32_reg_mem = 32,
/**
* 32-bit GPR encoded in the `mod + r/m` fields of the modrm byte
*/
  r32_rm = 33,
/**
* 32-bit GPR encoded in the low 3 bits of the opcode
*/
  r32_opcode = 34,
/**
* 32-bit GPR encoded in the the `V'vvvv` field (VEX/EVEX/XOP)
*/
  r32_vvvv = 35,
/**
* 64-bit GPR encoded in the `reg` field of the modrm byte
*/
  r64_reg = 36,
/**
* 64-bit GPR encoded in the `reg` field of the modrm byte. This is a memory operand and it uses the address size prefix (`67h`) not the operand size prefix (`66h`).
*/
  r64_reg_mem = 37,
/**
* 64-bit GPR encoded in the `mod + r/m` fields of the modrm byte
*/
  r64_rm = 38,
/**
* 64-bit GPR encoded in the low 3 bits of the opcode
*/
  r64_opcode = 39,
/**
* 64-bit GPR encoded in the the `V'vvvv` field (VEX/EVEX/XOP)
*/
  r64_vvvv = 40,
/**
* Segment register encoded in the `reg` field of the modrm byte
*/
  seg_reg = 41,
/**
* `K` register encoded in the `reg` field of the modrm byte
*/
  k_reg = 42,
/**
* `K` register (+1) encoded in the `reg` field of the modrm byte
*/
  kp1_reg = 43,
/**
* `K` register encoded in the `mod + r/m` fields of the modrm byte
*/
  k_rm = 44,
/**
* `K` register encoded in the the `V'vvvv` field (VEX/EVEX/MVEX/XOP)
*/
  k_vvvv = 45,
/**
* `MM` register encoded in the `reg` field of the modrm byte
*/
  mm_reg = 46,
/**
* `MM` register encoded in the `mod + r/m` fields of the modrm byte
*/
  mm_rm = 47,
/**
* `XMM` register encoded in the `reg` field of the modrm byte
*/
  xmm_reg = 48,
/**
* `XMM` register encoded in the `mod + r/m` fields of the modrm byte
*/
  xmm_rm = 49,
/**
* `XMM` register encoded in the the `V'vvvv` field (VEX/EVEX/XOP)
*/
  xmm_vvvv = 50,
/**
* `XMM` register (+3) encoded in the the `V'vvvv` field (VEX/EVEX/XOP)
*/
  xmmp3_vvvv = 51,
/**
* `XMM` register encoded in the the high 4 bits of the last 8-bit immediate (VEX/XOP only so only `XMM0`-`XMM15`)
*/
  xmm_is4 = 52,
/**
* `XMM` register encoded in the the high 4 bits of the last 8-bit immediate (VEX/XOP only so only `XMM0`-`XMM15`)
*/
  xmm_is5 = 53,
/**
* `YMM` register encoded in the `reg` field of the modrm byte
*/
  ymm_reg = 54,
/**
* `YMM` register encoded in the `mod + r/m` fields of the modrm byte
*/
  ymm_rm = 55,
/**
* `YMM` register encoded in the the `V'vvvv` field (VEX/EVEX/XOP)
*/
  ymm_vvvv = 56,
/**
* `YMM` register encoded in the the high 4 bits of the last 8-bit immediate (VEX/XOP only so only `YMM0`-`YMM15`)
*/
  ymm_is4 = 57,
/**
* `YMM` register encoded in the the high 4 bits of the last 8-bit immediate (VEX/XOP only so only `YMM0`-`YMM15`)
*/
  ymm_is5 = 58,
/**
* `ZMM` register encoded in the `reg` field of the modrm byte
*/
  zmm_reg = 59,
/**
* `ZMM` register encoded in the `mod + r/m` fields of the modrm byte
*/
  zmm_rm = 60,
/**
* `ZMM` register encoded in the the `V'vvvv` field (VEX/EVEX/MVEX/XOP)
*/
  zmm_vvvv = 61,
/**
* `ZMM` register (+3) encoded in the the `V'vvvv` field (VEX/EVEX/XOP)
*/
  zmmp3_vvvv = 62,
/**
* `CR` register encoded in the `reg` field of the modrm byte
*/
  cr_reg = 63,
/**
* `DR` register encoded in the `reg` field of the modrm byte
*/
  dr_reg = 64,
/**
* `TR` register encoded in the `reg` field of the modrm byte
*/
  tr_reg = 65,
/**
* `BND` register encoded in the `reg` field of the modrm byte
*/
  bnd_reg = 66,
/**
* `ES` register
*/
  es = 67,
/**
* `CS` register
*/
  cs = 68,
/**
* `SS` register
*/
  ss = 69,
/**
* `DS` register
*/
  ds = 70,
/**
* `FS` register
*/
  fs = 71,
/**
* `GS` register
*/
  gs = 72,
/**
* `AL` register
*/
  al = 73,
/**
* `CL` register
*/
  cl = 74,
/**
* `AX` register
*/
  ax = 75,
/**
* `DX` register
*/
  dx = 76,
/**
* `EAX` register
*/
  eax = 77,
/**
* `RAX` register
*/
  rax = 78,
/**
* `ST(0)` register
*/
  st0 = 79,
/**
* `ST(i)` register encoded in the low 3 bits of the opcode
*/
  sti_opcode = 80,
/**
* 4-bit immediate (m2z field, low 4 bits of the /is5 immediate, eg. `VPERMIL2PS`)
*/
  imm4_m2z = 81,
/**
* 8-bit immediate
*/
  imm8 = 82,
/**
* Constant 1 (8-bit immediate)
*/
  imm8_const_1 = 83,
/**
* 8-bit immediate sign extended to 16 bits
*/
  imm8sex16 = 84,
/**
* 8-bit immediate sign extended to 32 bits
*/
  imm8sex32 = 85,
/**
* 8-bit immediate sign extended to 64 bits
*/
  imm8sex64 = 86,
/**
* 16-bit immediate
*/
  imm16 = 87,
/**
* 32-bit immediate
*/
  imm32 = 88,
/**
* 32-bit immediate sign extended to 64 bits
*/
  imm32sex64 = 89,
/**
* 64-bit immediate
*/
  imm64 = 90,
/**
* `seg:[rSI]` memory operand (string instructions)
*/
  seg_rSI = 91,
/**
* `es:[rDI]` memory operand (string instructions)
*/
  es_rDI = 92,
/**
* `seg:[rDI]` memory operand (`(V)MASKMOVQ` instructions)
*/
  seg_rDI = 93,
/**
* `seg:[rBX+al]` memory operand (`XLATB` instruction)
*/
  seg_rBX_al = 94,
/**
* 16-bit branch, 1-byte signed relative offset
*/
  br16_1 = 95,
/**
* 32-bit branch, 1-byte signed relative offset
*/
  br32_1 = 96,
/**
* 64-bit branch, 1-byte signed relative offset
*/
  br64_1 = 97,
/**
* 16-bit branch, 2-byte signed relative offset
*/
  br16_2 = 98,
/**
* 32-bit branch, 4-byte signed relative offset
*/
  br32_4 = 99,
/**
* 64-bit branch, 4-byte signed relative offset
*/
  br64_4 = 100,
/**
* `XBEGIN`, 2-byte signed relative offset
*/
  xbegin_2 = 101,
/**
* `XBEGIN`, 4-byte signed relative offset
*/
  xbegin_4 = 102,
/**
* 2-byte branch offset (`JMPE` instruction)
*/
  brdisp_2 = 103,
/**
* 4-byte branch offset (`JMPE` instruction)
*/
  brdisp_4 = 104,
/**
* Memory (modrm) and the sib byte must be present
*/
  sibmem = 105,
/**
* `TMM` register encoded in the `reg` field of the modrm byte
*/
  tmm_reg = 106,
/**
* `TMM` register encoded in the `mod + r/m` fields of the modrm byte
*/
  tmm_rm = 107,
/**
* `TMM` register encoded in the the `V'vvvv` field (VEX/EVEX/XOP)
*/
  tmm_vvvv = 108,
}
/**
* The code size (16/32/64) that was used when an instruction was decoded
*/
export enum CodeSize {
/**
* Unknown size
*/
  Unknown = 0,
/**
* 16-bit code
*/
  Code16 = 1,
/**
* 32-bit code
*/
  Code32 = 2,
/**
* 64-bit code
*/
  Code64 = 3,
}
/**
* Mnemonic condition code selector (eg. `JLE` / `JNG`)
*/
export enum CC_le {
/**
* `JLE`, `CMOVLE`, `SETLE`
*/
  le = 0,
/**
* `JNG`, `CMOVNG`, `SETNG`
*/
  ng = 1,
}
/**
* Mnemonic condition code selector (eg. `JNE` / `JNZ`)
*/
export enum CC_ne {
/**
* `JNE`, `CMOVNE`, `SETNE`, `LOOPNE`, `REPNE`
*/
  ne = 0,
/**
* `JNZ`, `CMOVNZ`, `SETNZ`, `LOOPNZ`, `REPNZ`
*/
  nz = 1,
}
/**
* Mnemonic condition code selector (eg. `JA` / `JNBE`)
*/
export enum CC_a {
/**
* `JA`, `CMOVA`, `SETA`
*/
  a = 0,
/**
* `JNBE`, `CMOVNBE`, `SETNBE`
*/
  nbe = 1,
}
/**
* Operand, register and memory access
*/
export enum OpAccess {
/**
* Nothing is read and nothing is written
*/
  None = 0,
/**
* The value is read
*/
  Read = 1,
/**
* The value is sometimes read and sometimes not
*/
  CondRead = 2,
/**
* The value is completely overwritten
*/
  Write = 3,
/**
* Conditional write, sometimes it's written and sometimes it's not modified
*/
  CondWrite = 4,
/**
* The value is read and written
*/
  ReadWrite = 5,
/**
* The value is read and sometimes written
*/
  ReadCondWrite = 6,
/**
* The memory operand doesn't refer to memory (eg. `LEA` instruction) or it's an instruction that doesn't read the data to a register or doesn't write to the memory location, it just prefetches/invalidates it, eg. `INVLPG`, `PREFETCHNTA`, `VGATHERPF0DPS`, etc. Some of those instructions still check if the code can access the memory location.
*/
  NoMemAccess = 7,
}
/**
* Opcode table
*/
export enum OpCodeTableKind {
/**
* Legacy/`MAP0` table
*/
  Normal = 0,
/**
* `0F`/`MAP1` table (legacy, VEX, EVEX, MVEX)
*/
  T0F = 1,
/**
* `0F38`/`MAP2` table (legacy, VEX, EVEX, MVEX)
*/
  T0F38 = 2,
/**
* `0F3A`/`MAP3` table (legacy, VEX, EVEX, MVEX)
*/
  T0F3A = 3,
/**
* `MAP5` table (EVEX)
*/
  MAP5 = 4,
/**
* `MAP6` table (EVEX)
*/
  MAP6 = 5,
/**
* `MAP8` table (XOP)
*/
  MAP8 = 6,
/**
* `MAP9` table (XOP)
*/
  MAP9 = 7,
/**
* `MAP10` table (XOP)
*/
  MAP10 = 8,
}
/**
* Control flow
*/
export enum FlowControl {
/**
* The next instruction that will be executed is the next instruction in the instruction stream
*/
  Next = 0,
/**
* It's an unconditional branch instruction: `JMP NEAR`, `JMP FAR`
*/
  UnconditionalBranch = 1,
/**
* It's an unconditional indirect branch: `JMP NEAR reg`, `JMP NEAR [mem]`, `JMP FAR [mem]`
*/
  IndirectBranch = 2,
/**
* It's a conditional branch instruction: `Jcc SHORT`, `Jcc NEAR`, `LOOP`, `LOOPcc`, `JRCXZ`, `JKccD SHORT`, `JKccD NEAR`
*/
  ConditionalBranch = 3,
/**
* It's a return instruction: `RET NEAR`, `RET FAR`, `IRET`, `SYSRET`, `SYSEXIT`, `RSM`, `SKINIT`, `RDM`, `UIRET`
*/
  Return = 4,
/**
* It's a call instruction: `CALL NEAR`, `CALL FAR`, `SYSCALL`, `SYSENTER`, `VMLAUNCH`, `VMRESUME`, `VMCALL`, `VMMCALL`, `VMGEXIT`, `VMRUN`, `TDCALL`, `SEAMCALL`, `SEAMRET`
*/
  Call = 5,
/**
* It's an indirect call instruction: `CALL NEAR reg`, `CALL NEAR [mem]`, `CALL FAR [mem]`
*/
  IndirectCall = 6,
/**
* It's an interrupt instruction: `INT n`, `INT3`, `INT1`, `INTO`, `SMINT`, `DMINT`
*/
  Interrupt = 7,
/**
* It's `XBEGIN`
*/
  XbeginXabortXend = 8,
/**
* It's an invalid instruction, eg. [`Code.INVALID`], `UD0`, `UD1`, `UD2`
*
* [`Code.INVALID`]: enum.Code.html#variant.INVALID
*/
  Exception = 9,
}
/**
* Instruction operand kind
*/
export enum OpKind {
/**
* A register ([`Register`]).
*
* This operand kind uses [`Instruction.op0Register`], [`Instruction.op1Register`], [`Instruction.op2Register`], [`Instruction.op3Register`] or [`Instruction.op4Register`] depending on operand number. See also [`Instruction.opRegister()`].
*
* [`Register`]: enum.Register.html
* [`Instruction.op0Register`]: struct.Instruction.html#method.op0Register
* [`Instruction.op1Register`]: struct.Instruction.html#method.op1Register
* [`Instruction.op2Register`]: struct.Instruction.html#method.op2Register
* [`Instruction.op3Register`]: struct.Instruction.html#method.op3Register
* [`Instruction.op4Register`]: struct.Instruction.html#method.op4Register
* [`Instruction.opRegister()`]: struct.Instruction.html#method.opRegister
*/
  Register = 0,
/**
* Near 16-bit branch. This operand kind uses [`Instruction.nearBranch16`]
*
* [`Instruction.nearBranch16`]: struct.Instruction.html#method.nearBranch16
*/
  NearBranch16 = 1,
/**
* Near 32-bit branch. This operand kind uses [`Instruction.nearBranch32`]
*
* [`Instruction.nearBranch32`]: struct.Instruction.html#method.nearBranch32
*/
  NearBranch32 = 2,
/**
* Near 64-bit branch. This operand kind uses [`Instruction.nearBranch64`]
*
* [`Instruction.nearBranch64`]: struct.Instruction.html#method.nearBranch64
*/
  NearBranch64 = 3,
/**
* Far 16-bit branch. This operand kind uses [`Instruction.farBranch16`] and [`Instruction.farBranchSelector`]
*
* [`Instruction.farBranch16`]: struct.Instruction.html#method.farBranch16
* [`Instruction.farBranchSelector`]: struct.Instruction.html#method.farBranchSelector
*/
  FarBranch16 = 4,
/**
* Far 32-bit branch. This operand kind uses [`Instruction.farBranch32`] and [`Instruction.farBranchSelector`]
*
* [`Instruction.farBranch32`]: struct.Instruction.html#method.farBranch32
* [`Instruction.farBranchSelector`]: struct.Instruction.html#method.farBranchSelector
*/
  FarBranch32 = 5,
/**
* 8-bit constant. This operand kind uses [`Instruction.immediate8`]
*
* [`Instruction.immediate8`]: struct.Instruction.html#method.immediate8
*/
  Immediate8 = 6,
/**
* 8-bit constant used by the `ENTER`, `EXTRQ`, `INSERTQ` instructions. This operand kind uses [`Instruction.immediate8_2nd`]
*
* [`Instruction.immediate8_2nd`]: struct.Instruction.html#method.immediate8_2nd
*/
  Immediate8_2nd = 7,
/**
* 16-bit constant. This operand kind uses [`Instruction.immediate16`]
*
* [`Instruction.immediate16`]: struct.Instruction.html#method.immediate16
*/
  Immediate16 = 8,
/**
* 32-bit constant. This operand kind uses [`Instruction.immediate32`]
*
* [`Instruction.immediate32`]: struct.Instruction.html#method.immediate32
*/
  Immediate32 = 9,
/**
* 64-bit constant. This operand kind uses [`Instruction.immediate64`]
*
* [`Instruction.immediate64`]: struct.Instruction.html#method.immediate64
*/
  Immediate64 = 10,
/**
* An 8-bit value sign extended to 16 bits. This operand kind uses [`Instruction.immediate8to16`]
*
* [`Instruction.immediate8to16`]: struct.Instruction.html#method.immediate8to16
*/
  Immediate8to16 = 11,
/**
* An 8-bit value sign extended to 32 bits. This operand kind uses [`Instruction.immediate8to32`]
*
* [`Instruction.immediate8to32`]: struct.Instruction.html#method.immediate8to32
*/
  Immediate8to32 = 12,
/**
* An 8-bit value sign extended to 64 bits. This operand kind uses [`Instruction.immediate8to64`]
*
* [`Instruction.immediate8to64`]: struct.Instruction.html#method.immediate8to64
*/
  Immediate8to64 = 13,
/**
* A 32-bit value sign extended to 64 bits. This operand kind uses [`Instruction.immediate32to64`]
*
* [`Instruction.immediate32to64`]: struct.Instruction.html#method.immediate32to64
*/
  Immediate32to64 = 14,
/**
* `seg:[SI]`. This operand kind uses [`Instruction.memorySize`], [`Instruction.memorySegment`], [`Instruction.segmentPrefix`]
*
* [`Instruction.memorySize`]: struct.Instruction.html#method.memorySize
* [`Instruction.memorySegment`]: struct.Instruction.html#method.memorySegment
* [`Instruction.segmentPrefix`]: struct.Instruction.html#method.segmentPrefix
*/
  MemorySegSI = 15,
/**
* `seg:[ESI]`. This operand kind uses [`Instruction.memorySize`], [`Instruction.memorySegment`], [`Instruction.segmentPrefix`]
*
* [`Instruction.memorySize`]: struct.Instruction.html#method.memorySize
* [`Instruction.memorySegment`]: struct.Instruction.html#method.memorySegment
* [`Instruction.segmentPrefix`]: struct.Instruction.html#method.segmentPrefix
*/
  MemorySegESI = 16,
/**
* `seg:[RSI]`. This operand kind uses [`Instruction.memorySize`], [`Instruction.memorySegment`], [`Instruction.segmentPrefix`]
*
* [`Instruction.memorySize`]: struct.Instruction.html#method.memorySize
* [`Instruction.memorySegment`]: struct.Instruction.html#method.memorySegment
* [`Instruction.segmentPrefix`]: struct.Instruction.html#method.segmentPrefix
*/
  MemorySegRSI = 17,
/**
* `seg:[DI]`. This operand kind uses [`Instruction.memorySize`], [`Instruction.memorySegment`], [`Instruction.segmentPrefix`]
*
* [`Instruction.memorySize`]: struct.Instruction.html#method.memorySize
* [`Instruction.memorySegment`]: struct.Instruction.html#method.memorySegment
* [`Instruction.segmentPrefix`]: struct.Instruction.html#method.segmentPrefix
*/
  MemorySegDI = 18,
/**
* `seg:[EDI]`. This operand kind uses [`Instruction.memorySize`], [`Instruction.memorySegment`], [`Instruction.segmentPrefix`]
*
* [`Instruction.memorySize`]: struct.Instruction.html#method.memorySize
* [`Instruction.memorySegment`]: struct.Instruction.html#method.memorySegment
* [`Instruction.segmentPrefix`]: struct.Instruction.html#method.segmentPrefix
*/
  MemorySegEDI = 19,
/**
* `seg:[RDI]`. This operand kind uses [`Instruction.memorySize`], [`Instruction.memorySegment`], [`Instruction.segmentPrefix`]
*
* [`Instruction.memorySize`]: struct.Instruction.html#method.memorySize
* [`Instruction.memorySegment`]: struct.Instruction.html#method.memorySegment
* [`Instruction.segmentPrefix`]: struct.Instruction.html#method.segmentPrefix
*/
  MemorySegRDI = 20,
/**
* `ES:[DI]`. This operand kind uses [`Instruction.memorySize`]
*
* [`Instruction.memorySize`]: struct.Instruction.html#method.memorySize
*/
  MemoryESDI = 21,
/**
* `ES:[EDI]`. This operand kind uses [`Instruction.memorySize`]
*
* [`Instruction.memorySize`]: struct.Instruction.html#method.memorySize
*/
  MemoryESEDI = 22,
/**
* `ES:[RDI]`. This operand kind uses [`Instruction.memorySize`]
*
* [`Instruction.memorySize`]: struct.Instruction.html#method.memorySize
*/
  MemoryESRDI = 23,
/**
* Memory operand.
*
* This operand kind uses [`Instruction.memoryDisplSize`], [`Instruction.memorySize`], [`Instruction.memoryIndexScale`], [`Instruction.memoryDisplacement64`], [`Instruction.memoryBase`], [`Instruction.memoryIndex`], [`Instruction.memorySegment`], [`Instruction.segmentPrefix`]
*
* [`Instruction.memoryDisplSize`]: struct.Instruction.html#method.memoryDisplSize
* [`Instruction.memorySize`]: struct.Instruction.html#method.memorySize
* [`Instruction.memoryIndexScale`]: struct.Instruction.html#method.memoryIndexScale
* [`Instruction.memoryDisplacement64`]: struct.Instruction.html#method.memoryDisplacement64
* [`Instruction.memoryBase`]: struct.Instruction.html#method.memoryBase
* [`Instruction.memoryIndex`]: struct.Instruction.html#method.memoryIndex
* [`Instruction.memorySegment`]: struct.Instruction.html#method.memorySegment
* [`Instruction.segmentPrefix`]: struct.Instruction.html#method.segmentPrefix
*/
  Memory = 24,
}
/**
* Formatter syntax (GNU Assembler, Intel XED, masm, nasm)
*/
export enum FormatterSyntax {
/**
* GNU Assembler (AT&T)
*/
  Gas = 0,
/**
* Intel XED
*/
  Intel = 1,
/**
* masm
*/
  Masm = 2,
/**
* nasm
*/
  Nasm = 3,
}
/**
* A register
*/
export enum Register {
  None = 0,
  AL = 1,
  CL = 2,
  DL = 3,
  BL = 4,
  AH = 5,
  CH = 6,
  DH = 7,
  BH = 8,
  SPL = 9,
  BPL = 10,
  SIL = 11,
  DIL = 12,
  R8L = 13,
  R9L = 14,
  R10L = 15,
  R11L = 16,
  R12L = 17,
  R13L = 18,
  R14L = 19,
  R15L = 20,
  AX = 21,
  CX = 22,
  DX = 23,
  BX = 24,
  SP = 25,
  BP = 26,
  SI = 27,
  DI = 28,
  R8W = 29,
  R9W = 30,
  R10W = 31,
  R11W = 32,
  R12W = 33,
  R13W = 34,
  R14W = 35,
  R15W = 36,
  EAX = 37,
  ECX = 38,
  EDX = 39,
  EBX = 40,
  ESP = 41,
  EBP = 42,
  ESI = 43,
  EDI = 44,
  R8D = 45,
  R9D = 46,
  R10D = 47,
  R11D = 48,
  R12D = 49,
  R13D = 50,
  R14D = 51,
  R15D = 52,
  RAX = 53,
  RCX = 54,
  RDX = 55,
  RBX = 56,
  RSP = 57,
  RBP = 58,
  RSI = 59,
  RDI = 60,
  R8 = 61,
  R9 = 62,
  R10 = 63,
  R11 = 64,
  R12 = 65,
  R13 = 66,
  R14 = 67,
  R15 = 68,
  EIP = 69,
  RIP = 70,
  ES = 71,
  CS = 72,
  SS = 73,
  DS = 74,
  FS = 75,
  GS = 76,
  XMM0 = 77,
  XMM1 = 78,
  XMM2 = 79,
  XMM3 = 80,
  XMM4 = 81,
  XMM5 = 82,
  XMM6 = 83,
  XMM7 = 84,
  XMM8 = 85,
  XMM9 = 86,
  XMM10 = 87,
  XMM11 = 88,
  XMM12 = 89,
  XMM13 = 90,
  XMM14 = 91,
  XMM15 = 92,
  XMM16 = 93,
  XMM17 = 94,
  XMM18 = 95,
  XMM19 = 96,
  XMM20 = 97,
  XMM21 = 98,
  XMM22 = 99,
  XMM23 = 100,
  XMM24 = 101,
  XMM25 = 102,
  XMM26 = 103,
  XMM27 = 104,
  XMM28 = 105,
  XMM29 = 106,
  XMM30 = 107,
  XMM31 = 108,
  YMM0 = 109,
  YMM1 = 110,
  YMM2 = 111,
  YMM3 = 112,
  YMM4 = 113,
  YMM5 = 114,
  YMM6 = 115,
  YMM7 = 116,
  YMM8 = 117,
  YMM9 = 118,
  YMM10 = 119,
  YMM11 = 120,
  YMM12 = 121,
  YMM13 = 122,
  YMM14 = 123,
  YMM15 = 124,
  YMM16 = 125,
  YMM17 = 126,
  YMM18 = 127,
  YMM19 = 128,
  YMM20 = 129,
  YMM21 = 130,
  YMM22 = 131,
  YMM23 = 132,
  YMM24 = 133,
  YMM25 = 134,
  YMM26 = 135,
  YMM27 = 136,
  YMM28 = 137,
  YMM29 = 138,
  YMM30 = 139,
  YMM31 = 140,
  ZMM0 = 141,
  ZMM1 = 142,
  ZMM2 = 143,
  ZMM3 = 144,
  ZMM4 = 145,
  ZMM5 = 146,
  ZMM6 = 147,
  ZMM7 = 148,
  ZMM8 = 149,
  ZMM9 = 150,
  ZMM10 = 151,
  ZMM11 = 152,
  ZMM12 = 153,
  ZMM13 = 154,
  ZMM14 = 155,
  ZMM15 = 156,
  ZMM16 = 157,
  ZMM17 = 158,
  ZMM18 = 159,
  ZMM19 = 160,
  ZMM20 = 161,
  ZMM21 = 162,
  ZMM22 = 163,
  ZMM23 = 164,
  ZMM24 = 165,
  ZMM25 = 166,
  ZMM26 = 167,
  ZMM27 = 168,
  ZMM28 = 169,
  ZMM29 = 170,
  ZMM30 = 171,
  ZMM31 = 172,
  K0 = 173,
  K1 = 174,
  K2 = 175,
  K3 = 176,
  K4 = 177,
  K5 = 178,
  K6 = 179,
  K7 = 180,
  BND0 = 181,
  BND1 = 182,
  BND2 = 183,
  BND3 = 184,
  CR0 = 185,
  CR1 = 186,
  CR2 = 187,
  CR3 = 188,
  CR4 = 189,
  CR5 = 190,
  CR6 = 191,
  CR7 = 192,
  CR8 = 193,
  CR9 = 194,
  CR10 = 195,
  CR11 = 196,
  CR12 = 197,
  CR13 = 198,
  CR14 = 199,
  CR15 = 200,
  DR0 = 201,
  DR1 = 202,
  DR2 = 203,
  DR3 = 204,
  DR4 = 205,
  DR5 = 206,
  DR6 = 207,
  DR7 = 208,
  DR8 = 209,
  DR9 = 210,
  DR10 = 211,
  DR11 = 212,
  DR12 = 213,
  DR13 = 214,
  DR14 = 215,
  DR15 = 216,
  ST0 = 217,
  ST1 = 218,
  ST2 = 219,
  ST3 = 220,
  ST4 = 221,
  ST5 = 222,
  ST6 = 223,
  ST7 = 224,
  MM0 = 225,
  MM1 = 226,
  MM2 = 227,
  MM3 = 228,
  MM4 = 229,
  MM5 = 230,
  MM6 = 231,
  MM7 = 232,
  TR0 = 233,
  TR1 = 234,
  TR2 = 235,
  TR3 = 236,
  TR4 = 237,
  TR5 = 238,
  TR6 = 239,
  TR7 = 240,
  TMM0 = 241,
  TMM1 = 242,
  TMM2 = 243,
  TMM3 = 244,
  TMM4 = 245,
  TMM5 = 246,
  TMM6 = 247,
  TMM7 = 248,
/**
* Don't use it!
*
* ***************************************************
* DEPRECATED since 1.12.0: Not part of the public API
*/
  DontUse0 = 249,
/**
* Don't use it!
*
* ***************************************************
* DEPRECATED since 1.12.0: Not part of the public API
*/
  DontUseFA = 250,
/**
* Don't use it!
*
* ***************************************************
* DEPRECATED since 1.12.0: Not part of the public API
*/
  DontUseFB = 251,
/**
* Don't use it!
*
* ***************************************************
* DEPRECATED since 1.12.0: Not part of the public API
*/
  DontUseFC = 252,
/**
* Don't use it!
*
* ***************************************************
* DEPRECATED since 1.12.0: Not part of the public API
*/
  DontUseFD = 253,
/**
* Don't use it!
*
* ***************************************************
* DEPRECATED since 1.12.0: Not part of the public API
*/
  DontUseFE = 254,
/**
* Don't use it!
*
* ***************************************************
* DEPRECATED since 1.12.0: Not part of the public API
*/
  DontUseFF = 255,
}
/**
* Memory size options used by the formatters
*/
export enum MemorySizeOptions {
/**
* Show memory size if the assembler requires it, else don't show anything
*/
  Default = 0,
/**
* Always show the memory size, even if the assembler doesn't need it
*/
  Always = 1,
/**
* Show memory size if a human can't figure out the size of the operand
*/
  Minimal = 2,
/**
* Never show memory size
*/
  Never = 3,
}
/**
* Mnemonic condition code selector (eg. `JNP` / `JPO`)
*/
export enum CC_np {
/**
* `JNP`, `CMOVNP`, `SETNP`
*/
  np = 0,
/**
* `JPO`, `CMOVPO`, `SETPO`
*/
  po = 1,
}
/**
* `REP`/`REPE`/`REPNE` prefix
*/
export enum RepPrefixKind {
/**
* No `REP`/`REPE`/`REPNE` prefix
*/
  None = 0,
/**
* `REP`/`REPE` prefix
*/
  Repe = 1,
/**
* `REPNE` prefix
*/
  Repne = 2,
}
/**
* Instruction info options used by [`InstructionInfoFactory`]
*
* [`InstructionInfoFactory`]: struct.InstructionInfoFactory.html
*/
export enum InstructionInfoOptions {
/**
* No option is enabled
*/
  None = 0,
/**
* Don't include memory usage, i.e., [`InstructionInfo.usedMemory()`] will return an empty vector. All
* registers that are used by memory operands are still returned by [`InstructionInfo.usedRegisters()`].
*
* [`InstructionInfo.usedMemory()`]: struct.InstructionInfo.html#method.used_memory
* [`InstructionInfo.usedRegisters()`]: struct.InstructionInfo.html#method.used_registers
*/
  NoMemoryUsage = 1,
/**
* Don't include register usage, i.e., [`InstructionInfo.usedRegisters()`] will return an empty vector
*
* [`InstructionInfo.usedRegisters()`]: struct.InstructionInfo.html#method.used_registers
*/
  NoRegisterUsage = 2,
}
/**
* Mnemonic condition code selector (eg. `JB` / `JC` / `JNAE`)
*/
export enum CC_b {
/**
* `JB`, `CMOVB`, `SETB`
*/
  b = 0,
/**
* `JC`, `CMOVC`, `SETC`
*/
  c = 1,
/**
* `JNAE`, `CMOVNAE`, `SETNAE`
*/
  nae = 2,
}
/**
* (MVEX) EH bit value
*/
export enum MvexEHBit {
/**
* Not hard coded to 0 or 1 so can be used for other purposes
*/
  None = 0,
/**
* EH bit must be 0
*/
  EH0 = 1,
/**
* EH bit must be 1
*/
  EH1 = 2,
}
/**
* MVEX register/memory operand conversion
*/
export enum MvexRegMemConv {
/**
* No operand conversion
*/
  None = 0,
/**
* Register swizzle: `zmm0` or `zmm0 {dcba}`
*/
  RegSwizzleNone = 1,
/**
* Register swizzle: `zmm0 {cdab}`
*/
  RegSwizzleCdab = 2,
/**
* Register swizzle: `zmm0 {badc}`
*/
  RegSwizzleBadc = 3,
/**
* Register swizzle: `zmm0 {dacb}`
*/
  RegSwizzleDacb = 4,
/**
* Register swizzle: `zmm0 {aaaa}`
*/
  RegSwizzleAaaa = 5,
/**
* Register swizzle: `zmm0 {bbbb}`
*/
  RegSwizzleBbbb = 6,
/**
* Register swizzle: `zmm0 {cccc}`
*/
  RegSwizzleCccc = 7,
/**
* Register swizzle: `zmm0 {dddd}`
*/
  RegSwizzleDddd = 8,
/**
* Memory Up/DownConv: `[rax]` / `zmm0`
*/
  MemConvNone = 9,
/**
* Memory UpConv: `[rax] {1to16}` or `[rax] {1to8}`
*/
  MemConvBroadcast1 = 10,
/**
* Memory UpConv: `[rax] {4to16}` or `[rax] {4to8}`
*/
  MemConvBroadcast4 = 11,
/**
* Memory Up/DownConv: `[rax] {float16}` / `zmm0 {float16}`
*/
  MemConvFloat16 = 12,
/**
* Memory Up/DownConv: `[rax] {uint8}` / `zmm0 {uint8}`
*/
  MemConvUint8 = 13,
/**
* Memory Up/DownConv: `[rax] {sint8}` / `zmm0 {sint8}`
*/
  MemConvSint8 = 14,
/**
* Memory Up/DownConv: `[rax] {uint16}` / `zmm0 {uint16}`
*/
  MemConvUint16 = 15,
/**
* Memory Up/DownConv: `[rax] {sint16}` / `zmm0 {sint16}`
*/
  MemConvSint16 = 16,
}
/**
* Mnemonic condition code selector (eg. `JP` / `JPE`)
*/
export enum CC_p {
/**
* `JP`, `CMOVP`, `SETP`
*/
  p = 0,
/**
* `JPE`, `CMOVPE`, `SETPE`
*/
  pe = 1,
}
/**
* Instruction encoding
*/
export enum EncodingKind {
/**
* Legacy encoding
*/
  Legacy = 0,
/**
* VEX encoding
*/
  VEX = 1,
/**
* EVEX encoding
*/
  EVEX = 2,
/**
* XOP encoding
*/
  XOP = 3,
/**
* 3DNow! encoding
*/
  D3NOW = 4,
/**
* MVEX encoding
*/
  MVEX = 5,
}
/**
* MVEX conversion function
*/
export enum MvexConvFn {
/**
* No conversion function
*/
  None = 0,
/**
* Sf32(xxx)
*/
  Sf32 = 1,
/**
* Sf64(xxx)
*/
  Sf64 = 2,
/**
* Si32(xxx)
*/
  Si32 = 3,
/**
* Si64(xxx)
*/
  Si64 = 4,
/**
* Uf32(xxx)
*/
  Uf32 = 5,
/**
* Uf64(xxx)
*/
  Uf64 = 6,
/**
* Ui32(xxx)
*/
  Ui32 = 7,
/**
* Ui64(xxx)
*/
  Ui64 = 8,
/**
* Df32(xxx)
*/
  Df32 = 9,
/**
* Df64(xxx)
*/
  Df64 = 10,
/**
* Di32(xxx)
*/
  Di32 = 11,
/**
* Di64(xxx)
*/
  Di64 = 12,
}
/**
* Decoder options
*/
export enum DecoderOptions {
/**
* No option is enabled
*/
  None = 0,
/**
* Disable some checks for invalid encodings of instructions, eg. most instructions can't use a `LOCK` prefix so if one is found, they're decoded as [`Code.INVALID`] unless this option is enabled.
*
* [`Code.INVALID`]: enum.Code.html#variant.INVALID
*/
  NoInvalidCheck = 1,
/**
* AMD decoder: allow 16-bit branch/ret instructions in 64-bit mode, no `o64 CALL/JMP FAR [mem], o64 LSS/LFS/LGS`, `UD0` has no modr/m byte, decode `LOCK MOV CR`. The AMD decoder can still decode Intel instructions.
*/
  AMD = 2,
/**
* Decode opcodes `0F0D` and `0F18-0F1F` as reserved-nop instructions (eg. [`Code.Reservednop_rm32_r32_0F1D`])
*
* [`Code.Reservednop_rm32_r32_0F1D`]: enum.Code.html#variant.Reservednop_rm32_r32_0F1D
*/
  ForceReservedNop = 4,
/**
* Decode `UMOV` instructions
*/
  Umov = 8,
/**
* Decode `XBTS`/`IBTS`
*/
  Xbts = 16,
/**
* Decode `0FA6`/`0FA7` as `CMPXCHG`
*/
  Cmpxchg486A = 32,
/**
* Decode some old removed FPU instructions (eg. `FRSTPM`)
*/
  OldFpu = 64,
/**
* Decode `PCOMMIT`
*/
  Pcommit = 128,
/**
* Decode 286 `STOREALL`/`LOADALL` (`0F04` and `0F05`)
*/
  Loadall286 = 256,
/**
* Decode 386 `LOADALL`
*/
  Loadall386 = 512,
/**
* Decode `CL1INVMB`
*/
  Cl1invmb = 1024,
/**
* Decode `MOV r32,tr` and `MOV tr,r32`
*/
  MovTr = 2048,
/**
* Decode `JMPE` instructions
*/
  Jmpe = 4096,
/**
* Don't decode `PAUSE`, decode `NOP` instead
*/
  NoPause = 8192,
/**
* Don't decode `WBNOINVD`, decode `WBINVD` instead
*/
  NoWbnoinvd = 16384,
/**
* Decode undocumented Intel `RDUDBG` and `WRUDBG` instructions
*/
  Udbg = 32768,
/**
* Don't decode `TZCNT`, decode `BSF` instead
*/
  NoMPFX_0FBC = 65536,
/**
* Don't decode `LZCNT`, decode `BSR` instead
*/
  NoMPFX_0FBD = 131072,
/**
* Don't decode `LAHF` and `SAHF` in 64-bit mode
*/
  NoLahfSahf64 = 262144,
/**
* Decode `MPX` instructions
*/
  MPX = 524288,
/**
* Decode most Cyrix instructions: `FPU`, `EMMI`, `SMM`, `DDI`
*/
  Cyrix = 1048576,
/**
* Decode Cyrix `SMINT 0F7E` (Cyrix 6x86 or earlier)
*/
  Cyrix_SMINT_0F7E = 2097152,
/**
* Decode Cyrix `DMI` instructions (AMD Geode GX/LX)
*/
  Cyrix_DMI = 4194304,
/**
* Decode Centaur `ALTINST`
*/
  ALTINST = 8388608,
/**
* Decode Intel Knights Corner instructions (requires the `mvex` feature)
*/
  KNC = 16777216,
}
/**
* Mnemonic condition code selector (eg. `JBE` / `JNA`)
*/
export enum CC_be {
/**
* `JBE`, `CMOVBE`, `SETBE`
*/
  be = 0,
/**
* `JNA`, `CMOVNA`, `SETNA`
*/
  na = 1,
}
/**
* MVEX tuple type lut kind used together with the `MVEX.SSS` bits to get the tuple type
*/
export enum MvexTupleTypeLutKind {
/**
* `i32` elements, eg. `Si32`/`Di32`/`Ui32`
*/
  Int32 = 0,
/**
* `i32` elements, eg. `Si32`/`Di32`/`Ui32` with half memory size (32 bytes instead of 64 bytes, eg. `VCVTUDQ2PD`/`VCVTDQ2PD`)
*/
  Int32_Half = 1,
/**
* `i32` elements, eg. `Si32`/`Di32`/`Ui32` with built-in `{4to16}` broadcast
*/
  Int32_4to16 = 2,
/**
* `i32` elements, eg. `Si32`/`Di32`/`Ui32` with built-in `{1to16}` broadcast or element level
*/
  Int32_1to16_or_elem = 3,
/**
* `i64` elements, eg. `Si64`/`Di64`/`Ui64`
*/
  Int64 = 4,
/**
* `i64` elements, eg. `Si64`/`Di64`/`Ui64` with built-in `{4to8}` broadcast
*/
  Int64_4to8 = 5,
/**
* `i64` elements, eg. `Si64`/`Di64`/`Ui64` with built-in `{1to8}` broadcast or element level
*/
  Int64_1to8_or_elem = 6,
/**
* `f32` elements, eg. `Sf32`/`Df32`/`Uf32`
*/
  Float32 = 7,
/**
* `f32` elements, eg. `Sf32`/`Df32`/`Uf32` with half memory size (32 bytes instead of 64 bytes, eg. `VCVTPS2PD`
*/
  Float32_Half = 8,
/**
* `f32` elements, eg. `Sf32`/`Df32`/`Uf32` with built-in `{4to16}` broadcast
*/
  Float32_4to16 = 9,
/**
* `f32` elements, eg. `Sf32`/`Df32`/`Uf32` with built-in `{1to16}` broadcast or element level
*/
  Float32_1to16_or_elem = 10,
/**
* `f64` elements, eg. `Sf64`/`Df64`/`Uf64`
*/
  Float64 = 11,
/**
* `f64` elements, eg. `Sf64`/`Df64`/`Uf64` with built-in `{4to8}` broadcast
*/
  Float64_4to8 = 12,
/**
* `f64` elements, eg. `Sf64`/`Df64`/`Uf64` with built-in `{1to8}` broadcast or element level
*/
  Float64_1to8_or_elem = 13,
}
/**
* [`BlockEncoder`] options
*
* [`BlockEncoder`]: struct.BlockEncoder.html
*/
export enum BlockEncoderOptions {
/**
* No option is set
*/
  None = 0,
/**
* By default, branches get updated if the target is too far away, eg. `Jcc SHORT` -> `Jcc NEAR` or if 64-bit mode, `Jcc + JMP [RIP+mem]`. If this option is enabled, no branches are fixed.
*/
  DontFixBranches = 1,
/**
* The [`BlockEncoder`] should return [`RelocInfo`]s
*
* [`BlockEncoder`]: struct.BlockEncoder.html
* [`RelocInfo`]: struct.RelocInfo.html
*/
  ReturnRelocInfos = 2,
/**
* The [`BlockEncoder`] should return new instruction offsets
*
* [`BlockEncoder`]: struct.BlockEncoder.html
*/
  ReturnNewInstructionOffsets = 4,
/**
* The [`BlockEncoder`] should return [`ConstantOffsets`]
*
* [`BlockEncoder`]: struct.BlockEncoder.html
* [`ConstantOffsets`]: struct.ConstantOffsets.html
*/
  ReturnConstantOffsets = 8,
}
/**
* Mandatory prefix
*/
export enum MandatoryPrefix {
/**
* No mandatory prefix (legacy and 3DNow! tables only)
*/
  None = 0,
/**
* Empty mandatory prefix (no `66`, `F3` or `F2` prefix)
*/
  PNP = 1,
/**
* `66` prefix
*/
  P66 = 2,
/**
* `F3` prefix
*/
  PF3 = 3,
/**
* `F2` prefix
*/
  PF2 = 4,
}
/**
* `RFLAGS` bits, FPU condition code bits and misc bits (`UIF`) supported by the instruction info code
*/
export enum RflagsBits {
/**
* No bit is set
*/
  None = 0,
/**
* `RFLAGS.OF`
*/
  OF = 1,
/**
* `RFLAGS.SF`
*/
  SF = 2,
/**
* `RFLAGS.ZF`
*/
  ZF = 4,
/**
* `RFLAGS.AF`
*/
  AF = 8,
/**
* `RFLAGS.CF`
*/
  CF = 16,
/**
* `RFLAGS.PF`
*/
  PF = 32,
/**
* `RFLAGS.DF`
*/
  DF = 64,
/**
* `RFLAGS.IF`
*/
  IF = 128,
/**
* `RFLAGS.AC`
*/
  AC = 256,
/**
* `UIF`
*/
  UIF = 512,
/**
* FPU status word bit `C0`
*/
  C0 = 1024,
/**
* FPU status word bit `C1`
*/
  C1 = 2048,
/**
* FPU status word bit `C2`
*/
  C2 = 4096,
/**
* FPU status word bit `C3`
*/
  C3 = 8192,
}
/**
* Mnemonic condition code selector (eg. `JG` / `JNLE`)
*/
export enum CC_g {
/**
* `JG`, `CMOVG`, `SETG`
*/
  g = 0,
/**
* `JNLE`, `CMOVNLE`, `SETNLE`
*/
  nle = 1,
}
/**
* Mnemonic condition code selector (eg. `JL` / `JNGE`)
*/
export enum CC_l {
/**
* `JL`, `CMOVL`, `SETL`
*/
  l = 0,
/**
* `JNGE`, `CMOVNGE`, `SETNGE`
*/
  nge = 1,
}
/**
* Mnemonic condition code selector (eg. `JGE` / `JNL`)
*/
export enum CC_ge {
/**
* `JGE`, `CMOVGE`, `SETGE`
*/
  ge = 0,
/**
* `JNL`, `CMOVNL`, `SETNL`
*/
  nl = 1,
}
/**
* Size of a memory reference
*/
export enum MemorySize {
/**
* Unknown size or the instruction doesn't reference any memory (eg. `LEA`)
*/
  Unknown = 0,
/**
* Memory location contains a `u8`
*/
  UInt8 = 1,
/**
* Memory location contains a `u16`
*/
  UInt16 = 2,
/**
* Memory location contains a `u32`
*/
  UInt32 = 3,
/**
* Memory location contains a `u52`
*/
  UInt52 = 4,
/**
* Memory location contains a `u64`
*/
  UInt64 = 5,
/**
* Memory location contains a `u128`
*/
  UInt128 = 6,
/**
* Memory location contains a `u256`
*/
  UInt256 = 7,
/**
* Memory location contains a `u512`
*/
  UInt512 = 8,
/**
* Memory location contains a `i8`
*/
  Int8 = 9,
/**
* Memory location contains a `i16`
*/
  Int16 = 10,
/**
* Memory location contains a `i32`
*/
  Int32 = 11,
/**
* Memory location contains a `i64`
*/
  Int64 = 12,
/**
* Memory location contains a `i128`
*/
  Int128 = 13,
/**
* Memory location contains a `i256`
*/
  Int256 = 14,
/**
* Memory location contains a `i512`
*/
  Int512 = 15,
/**
* Memory location contains a seg:ptr pair, `u16` (offset) + `u16` (segment/selector)
*/
  SegPtr16 = 16,
/**
* Memory location contains a seg:ptr pair, `u32` (offset) + `u16` (segment/selector)
*/
  SegPtr32 = 17,
/**
* Memory location contains a seg:ptr pair, `u64` (offset) + `u16` (segment/selector)
*/
  SegPtr64 = 18,
/**
* Memory location contains a 16-bit offset (`JMP/CALL WORD PTR [mem]`)
*/
  WordOffset = 19,
/**
* Memory location contains a 32-bit offset (`JMP/CALL DWORD PTR [mem]`)
*/
  DwordOffset = 20,
/**
* Memory location contains a 64-bit offset (`JMP/CALL QWORD PTR [mem]`)
*/
  QwordOffset = 21,
/**
* Memory location contains two `u16`s (16-bit `BOUND`)
*/
  Bound16_WordWord = 22,
/**
* Memory location contains two `u32`s (32-bit `BOUND`)
*/
  Bound32_DwordDword = 23,
/**
* 32-bit `BNDMOV`, 2 x `u32`
*/
  Bnd32 = 24,
/**
* 64-bit `BNDMOV`, 2 x `u64`
*/
  Bnd64 = 25,
/**
* Memory location contains a 16-bit limit and a 32-bit address (eg. `LGDTW`, `LGDTD`)
*/
  Fword6 = 26,
/**
* Memory location contains a 16-bit limit and a 64-bit address (eg. `LGDTQ`)
*/
  Fword10 = 27,
/**
* Memory location contains a `f16`
*/
  Float16 = 28,
/**
* Memory location contains a `f32`
*/
  Float32 = 29,
/**
* Memory location contains a `f64`
*/
  Float64 = 30,
/**
* Memory location contains a `f80`
*/
  Float80 = 31,
/**
* Memory location contains a `f128`
*/
  Float128 = 32,
/**
* Memory location contains a `bfloat16`
*/
  BFloat16 = 33,
/**
* Memory location contains a 14-byte FPU environment (16-bit `FLDENV`/`FSTENV`)
*/
  FpuEnv14 = 34,
/**
* Memory location contains a 28-byte FPU environment (32/64-bit `FLDENV`/`FSTENV`)
*/
  FpuEnv28 = 35,
/**
* Memory location contains a 94-byte FPU environment (16-bit `FSAVE`/`FRSTOR`)
*/
  FpuState94 = 36,
/**
* Memory location contains a 108-byte FPU environment (32/64-bit `FSAVE`/`FRSTOR`)
*/
  FpuState108 = 37,
/**
* Memory location contains 512-bytes of `FXSAVE`/`FXRSTOR` data
*/
  Fxsave_512Byte = 38,
/**
* Memory location contains 512-bytes of `FXSAVE64`/`FXRSTOR64` data
*/
  Fxsave64_512Byte = 39,
/**
* 32-bit `XSAVE` area
*/
  Xsave = 40,
/**
* 64-bit `XSAVE` area
*/
  Xsave64 = 41,
/**
* Memory location contains a 10-byte `bcd` value (`FBLD`/`FBSTP`)
*/
  Bcd = 42,
/**
* 64-bit location: TILECFG (`LDTILECFG`/`STTILECFG`)
*/
  Tilecfg = 43,
/**
* Tile data
*/
  Tile = 44,
/**
* 80-bit segment descriptor and selector: 0-7 = descriptor, 8-9 = selector
*/
  SegmentDescSelector = 45,
/**
* 384-bit AES 128 handle (Key Locker)
*/
  KLHandleAes128 = 46,
/**
* 512-bit AES 256 handle (Key Locker)
*/
  KLHandleAes256 = 47,
/**
* 16-bit location: 2 x `u8`
*/
  Packed16_UInt8 = 48,
/**
* 16-bit location: 2 x `i8`
*/
  Packed16_Int8 = 49,
/**
* 32-bit location: 4 x `u8`
*/
  Packed32_UInt8 = 50,
/**
* 32-bit location: 4 x `i8`
*/
  Packed32_Int8 = 51,
/**
* 32-bit location: 2 x `u16`
*/
  Packed32_UInt16 = 52,
/**
* 32-bit location: 2 x `i16`
*/
  Packed32_Int16 = 53,
/**
* 32-bit location: 2 x `f16`
*/
  Packed32_Float16 = 54,
/**
* 32-bit location: 2 x `bfloat16`
*/
  Packed32_BFloat16 = 55,
/**
* 64-bit location: 8 x `u8`
*/
  Packed64_UInt8 = 56,
/**
* 64-bit location: 8 x `i8`
*/
  Packed64_Int8 = 57,
/**
* 64-bit location: 4 x `u16`
*/
  Packed64_UInt16 = 58,
/**
* 64-bit location: 4 x `i16`
*/
  Packed64_Int16 = 59,
/**
* 64-bit location: 2 x `u32`
*/
  Packed64_UInt32 = 60,
/**
* 64-bit location: 2 x `i32`
*/
  Packed64_Int32 = 61,
/**
* 64-bit location: 4 x `f16`
*/
  Packed64_Float16 = 62,
/**
* 64-bit location: 2 x `f32`
*/
  Packed64_Float32 = 63,
/**
* 128-bit location: 16 x `u8`
*/
  Packed128_UInt8 = 64,
/**
* 128-bit location: 16 x `i8`
*/
  Packed128_Int8 = 65,
/**
* 128-bit location: 8 x `u16`
*/
  Packed128_UInt16 = 66,
/**
* 128-bit location: 8 x `i16`
*/
  Packed128_Int16 = 67,
/**
* 128-bit location: 4 x `u32`
*/
  Packed128_UInt32 = 68,
/**
* 128-bit location: 4 x `i32`
*/
  Packed128_Int32 = 69,
/**
* 128-bit location: 2 x `u52`
*/
  Packed128_UInt52 = 70,
/**
* 128-bit location: 2 x `u64`
*/
  Packed128_UInt64 = 71,
/**
* 128-bit location: 2 x `i64`
*/
  Packed128_Int64 = 72,
/**
* 128-bit location: 8 x `f16`
*/
  Packed128_Float16 = 73,
/**
* 128-bit location: 4 x `f32`
*/
  Packed128_Float32 = 74,
/**
* 128-bit location: 2 x `f64`
*/
  Packed128_Float64 = 75,
/**
* 128-bit location: 8 x `bfloat16`
*/
  Packed128_BFloat16 = 76,
/**
* 128-bit location: 4 x (2 x `f16`)
*/
  Packed128_2xFloat16 = 77,
/**
* 128-bit location: 4 x (2 x `bfloat16`)
*/
  Packed128_2xBFloat16 = 78,
/**
* 256-bit location: 32 x `u8`
*/
  Packed256_UInt8 = 79,
/**
* 256-bit location: 32 x `i8`
*/
  Packed256_Int8 = 80,
/**
* 256-bit location: 16 x `u16`
*/
  Packed256_UInt16 = 81,
/**
* 256-bit location: 16 x `i16`
*/
  Packed256_Int16 = 82,
/**
* 256-bit location: 8 x `u32`
*/
  Packed256_UInt32 = 83,
/**
* 256-bit location: 8 x `i32`
*/
  Packed256_Int32 = 84,
/**
* 256-bit location: 4 x `u52`
*/
  Packed256_UInt52 = 85,
/**
* 256-bit location: 4 x `u64`
*/
  Packed256_UInt64 = 86,
/**
* 256-bit location: 4 x `i64`
*/
  Packed256_Int64 = 87,
/**
* 256-bit location: 2 x `u128`
*/
  Packed256_UInt128 = 88,
/**
* 256-bit location: 2 x `i128`
*/
  Packed256_Int128 = 89,
/**
* 256-bit location: 16 x `f16`
*/
  Packed256_Float16 = 90,
/**
* 256-bit location: 8 x `f32`
*/
  Packed256_Float32 = 91,
/**
* 256-bit location: 4 x `f64`
*/
  Packed256_Float64 = 92,
/**
* 256-bit location: 2 x `f128`
*/
  Packed256_Float128 = 93,
/**
* 256-bit location: 16 x `bfloat16`
*/
  Packed256_BFloat16 = 94,
/**
* 256-bit location: 8 x (2 x `f16`)
*/
  Packed256_2xFloat16 = 95,
/**
* 256-bit location: 8 x (2 x `bfloat16`)
*/
  Packed256_2xBFloat16 = 96,
/**
* 512-bit location: 64 x `u8`
*/
  Packed512_UInt8 = 97,
/**
* 512-bit location: 64 x `i8`
*/
  Packed512_Int8 = 98,
/**
* 512-bit location: 32 x `u16`
*/
  Packed512_UInt16 = 99,
/**
* 512-bit location: 32 x `i16`
*/
  Packed512_Int16 = 100,
/**
* 512-bit location: 16 x `u32`
*/
  Packed512_UInt32 = 101,
/**
* 512-bit location: 16 x `i32`
*/
  Packed512_Int32 = 102,
/**
* 512-bit location: 8 x `u52`
*/
  Packed512_UInt52 = 103,
/**
* 512-bit location: 8 x `u64`
*/
  Packed512_UInt64 = 104,
/**
* 512-bit location: 8 x `i64`
*/
  Packed512_Int64 = 105,
/**
* 256-bit location: 4 x `u128`
*/
  Packed512_UInt128 = 106,
/**
* 512-bit location: 32 x `f16`
*/
  Packed512_Float16 = 107,
/**
* 512-bit location: 16 x `f32`
*/
  Packed512_Float32 = 108,
/**
* 512-bit location: 8 x `f64`
*/
  Packed512_Float64 = 109,
/**
* 512-bit location: 16 x (2 x `f16`)
*/
  Packed512_2xFloat16 = 110,
/**
* 512-bit location: 16 x (2 x `bfloat16`)
*/
  Packed512_2xBFloat16 = 111,
/**
* Broadcast `f16` to 32-bits
*/
  Broadcast32_Float16 = 112,
/**
* Broadcast `u32` to 64-bits
*/
  Broadcast64_UInt32 = 113,
/**
* Broadcast `i32` to 64-bits
*/
  Broadcast64_Int32 = 114,
/**
* Broadcast `f16` to 64-bits
*/
  Broadcast64_Float16 = 115,
/**
* Broadcast `f32` to 64-bits
*/
  Broadcast64_Float32 = 116,
/**
* Broadcast `i16` to 128-bits
*/
  Broadcast128_Int16 = 117,
/**
* Broadcast `u16` to 128-bits
*/
  Broadcast128_UInt16 = 118,
/**
* Broadcast `u32` to 128-bits
*/
  Broadcast128_UInt32 = 119,
/**
* Broadcast `i32` to 128-bits
*/
  Broadcast128_Int32 = 120,
/**
* Broadcast `u52` to 128-bits
*/
  Broadcast128_UInt52 = 121,
/**
* Broadcast `u64` to 128-bits
*/
  Broadcast128_UInt64 = 122,
/**
* Broadcast `i64` to 128-bits
*/
  Broadcast128_Int64 = 123,
/**
* Broadcast `f16` to 128-bits
*/
  Broadcast128_Float16 = 124,
/**
* Broadcast `f32` to 128-bits
*/
  Broadcast128_Float32 = 125,
/**
* Broadcast `f64` to 128-bits
*/
  Broadcast128_Float64 = 126,
/**
* Broadcast 2 x `i16` to 128-bits
*/
  Broadcast128_2xInt16 = 127,
/**
* Broadcast 2 x `i32` to 128-bits
*/
  Broadcast128_2xInt32 = 128,
/**
* Broadcast 2 x `u32` to 128-bits
*/
  Broadcast128_2xUInt32 = 129,
/**
* Broadcast 2 x `f16` to 128-bits
*/
  Broadcast128_2xFloat16 = 130,
/**
* Broadcast 2 x `bfloat16` to 128-bits
*/
  Broadcast128_2xBFloat16 = 131,
/**
* Broadcast `i16` to 256-bits
*/
  Broadcast256_Int16 = 132,
/**
* Broadcast `u16` to 256-bits
*/
  Broadcast256_UInt16 = 133,
/**
* Broadcast `u32` to 256-bits
*/
  Broadcast256_UInt32 = 134,
/**
* Broadcast `i32` to 256-bits
*/
  Broadcast256_Int32 = 135,
/**
* Broadcast `u52` to 256-bits
*/
  Broadcast256_UInt52 = 136,
/**
* Broadcast `u64` to 256-bits
*/
  Broadcast256_UInt64 = 137,
/**
* Broadcast `i64` to 256-bits
*/
  Broadcast256_Int64 = 138,
/**
* Broadcast `f16` to 256-bits
*/
  Broadcast256_Float16 = 139,
/**
* Broadcast `f32` to 256-bits
*/
  Broadcast256_Float32 = 140,
/**
* Broadcast `f64` to 256-bits
*/
  Broadcast256_Float64 = 141,
/**
* Broadcast 2 x `i16` to 256-bits
*/
  Broadcast256_2xInt16 = 142,
/**
* Broadcast 2 x `i32` to 256-bits
*/
  Broadcast256_2xInt32 = 143,
/**
* Broadcast 2 x `u32` to 256-bits
*/
  Broadcast256_2xUInt32 = 144,
/**
* Broadcast 2 x `f16` to 256-bits
*/
  Broadcast256_2xFloat16 = 145,
/**
* Broadcast 2 x `bfloat16` to 256-bits
*/
  Broadcast256_2xBFloat16 = 146,
/**
* Broadcast `i16` to 512-bits
*/
  Broadcast512_Int16 = 147,
/**
* Broadcast `u16` to 512-bits
*/
  Broadcast512_UInt16 = 148,
/**
* Broadcast `u32` to 512-bits
*/
  Broadcast512_UInt32 = 149,
/**
* Broadcast `i32` to 512-bits
*/
  Broadcast512_Int32 = 150,
/**
* Broadcast `u52` to 512-bits
*/
  Broadcast512_UInt52 = 151,
/**
* Broadcast `u64` to 512-bits
*/
  Broadcast512_UInt64 = 152,
/**
* Broadcast `i64` to 512-bits
*/
  Broadcast512_Int64 = 153,
/**
* Broadcast `f16` to 512-bits
*/
  Broadcast512_Float16 = 154,
/**
* Broadcast `f32` to 512-bits
*/
  Broadcast512_Float32 = 155,
/**
* Broadcast `f64` to 512-bits
*/
  Broadcast512_Float64 = 156,
/**
* Broadcast 2 x `f16` to 512-bits
*/
  Broadcast512_2xFloat16 = 157,
/**
* Broadcast 2 x `i16` to 512-bits
*/
  Broadcast512_2xInt16 = 158,
/**
* Broadcast 2 x `u32` to 512-bits
*/
  Broadcast512_2xUInt32 = 159,
/**
* Broadcast 2 x `i32` to 512-bits
*/
  Broadcast512_2xInt32 = 160,
/**
* Broadcast 2 x `bfloat16` to 512-bits
*/
  Broadcast512_2xBFloat16 = 161,
}
/**
* Rounding control
*/
export enum RoundingControl {
/**
* No rounding mode
*/
  None = 0,
/**
* Round to nearest (even)
*/
  RoundToNearest = 1,
/**
* Round down (toward -inf)
*/
  RoundDown = 2,
/**
* Round up (toward +inf)
*/
  RoundUp = 3,
/**
* Round toward zero (truncate)
*/
  RoundTowardZero = 4,
}
/**
* Tuple type (EVEX/MVEX) which can be used to get the disp8 scale factor `N`
*/
export enum TupleType {
/**
* `N = 1`
*/
  N1 = 0,
/**
* `N = 2`
*/
  N2 = 1,
/**
* `N = 4`
*/
  N4 = 2,
/**
* `N = 8`
*/
  N8 = 3,
/**
* `N = 16`
*/
  N16 = 4,
/**
* `N = 32`
*/
  N32 = 5,
/**
* `N = 64`
*/
  N64 = 6,
/**
* `N = b ? 4 : 8`
*/
  N8b4 = 7,
/**
* `N = b ? 4 : 16`
*/
  N16b4 = 8,
/**
* `N = b ? 4 : 32`
*/
  N32b4 = 9,
/**
* `N = b ? 4 : 64`
*/
  N64b4 = 10,
/**
* `N = b ? 8 : 16`
*/
  N16b8 = 11,
/**
* `N = b ? 8 : 32`
*/
  N32b8 = 12,
/**
* `N = b ? 8 : 64`
*/
  N64b8 = 13,
/**
* `N = b ? 2 : 4`
*/
  N4b2 = 14,
/**
* `N = b ? 2 : 8`
*/
  N8b2 = 15,
/**
* `N = b ? 2 : 16`
*/
  N16b2 = 16,
/**
* `N = b ? 2 : 32`
*/
  N32b2 = 17,
/**
* `N = b ? 2 : 64`
*/
  N64b2 = 18,
}
/**
* Encodes instructions. It can be used to move instructions from one location to another location.
*/
export class BlockEncoder {
  free(): void;
/**
* Constructor
*
* # Throws
*
* Throws if `bitness` is not one of 16, 32, 64.
*
* # Arguments
*
* * `bitness`: 16, 32, or 64
* * `options`: Encoder options ([`BlockEncoderOptions`])
*
* [`BlockEncoderOptions`]: enum.BlockEncoderOptions.html
* @param {number} bitness
* @param {number} options
*/
  constructor(bitness: number, options: number);
/**
* Adds an instruction that will be encoded when [`encode()`] is called.
* The input `instruction` can be a decoded instruction or an instruction
* created by the user, eg. `Instruction.with*()` constructor methods.
*
* [`encode()`]: #method.encode
*
* # Arguments
*
* * `instruction`: Next instruction to encode
* @param {Instruction} instruction
*/
  add(instruction: Instruction): void;
/**
* Encodes all instructions added by [`add()`] and returns the encoded bytes
*
* [`add()`]: #method.add
*
* # Arguments
*
* * `rip`: Base IP of all encoded instructions
* @param {bigint} rip
* @returns {Uint8Array}
*/
  encode(rip: bigint): Uint8Array;
}
/**
* [`Code`] enum extension methods
*
* [`Code`]: enum.Code.html
*/
export class CodeExt {
  free(): void;
/**
* Gets a [`OpCodeInfo`]
*
* [`OpCodeInfo`]: struct.OpCodeInfo.html
* @param {Code} code
* @returns {OpCodeInfo}
*/
  static opCode(code: Code): OpCodeInfo;
}
/**
* Contains the offsets of the displacement and immediate. Call [`Decoder.getConstantOffsets()`] or
* [`Encoder.getConstantOffsets()`] to get the offsets of the constants after the instruction has been
* decoded/encoded.
*
* [`Decoder.getConstantOffsets()`]: struct.Decoder.html#method.get_constant_offsets
* [`Encoder.getConstantOffsets()`]: struct.Encoder.html#method.get_constant_offsets
*/
export class ConstantOffsets {
  free(): void;
/**
* The offset of the displacement, if any
*/
  readonly displacementOffset: number;
/**
* Size in bytes of the displacement, or 0 if there's no displacement
*/
  readonly displacementSize: number;
/**
* `true` if [`displacementOffset`] and [`displacementSize`] are valid
*
* [`displacementOffset`]: #method.displacement_offset
* [`displacementSize`]: #method.displacement_size
*/
  readonly hasDisplacement: boolean;
/**
* `true` if [`immediateOffset`] and [`immediateSize`] are valid
*
* [`immediateOffset`]: #method.immediate_offset
* [`immediateSize`]: #method.immediate_size
*/
  readonly hasImmediate: boolean;
/**
* `true` if [`immediateOffset2`] and [`immediateSize2`] are valid
*
* [`immediateOffset2`]: #method.immediate_offset2
* [`immediateSize2`]: #method.immediate_size2
*/
  readonly hasImmediate2: boolean;
/**
* The offset of the first immediate, if any.
*
* This field can be invalid even if the operand has an immediate if it's an immediate that isn't part
* of the instruction stream, eg. `SHL AL,1`.
*/
  readonly immediateOffset: number;
/**
* The offset of the second immediate, if any.
*/
  readonly immediateOffset2: number;
/**
* Size in bytes of the first immediate, or 0 if there's no immediate
*/
  readonly immediateSize: number;
/**
* Size in bytes of the second immediate, or 0 if there's no second immediate
*/
  readonly immediateSize2: number;
}
/**
* Decodes 16/32/64-bit x86 instructions
*/
export class Decoder {
  free(): void;
/**
* Creates a decoder
*
* # Throws
*
* Throws if `bitness` is not one of 16, 32, 64.
*
* # Arguments
*
* * `bitness`: 16, 32 or 64
* * `data`: Data to decode
* * `options`: Decoder options (a [`DecoderOptions`] flags value), `0` or eg. `DecoderOptions.NoInvalidCheck | DecoderOptions.AMD`
*
* [`DecoderOptions`]: enum.DecoderOptions.html
*
* # Examples
*
* ```js
* const assert = require("assert").strict;
* const { Code, Decoder, DecoderOptions, Mnemonic } = require("iced-x86");
*
* // xchg ah,[rdx+rsi+16h]
* // xacquire lock add dword ptr [rax],5Ah
* // vmovdqu64 zmm18{k3}{z},zmm11
* const bytes = new Uint8Array([0x86, 0x64, 0x32, 0x16, 0xF0, 0xF2, 0x83, 0x00, 0x5A, 0x62, 0xC1, 0xFE, 0xCB, 0x6F, 0xD3]);
* const decoder = new Decoder(64, bytes, DecoderOptions.None);
* decoder.ip = 0x12345678n;
*
* const instr = decoder.decode();
* assert.equal(instr.code, Code.Xchg_rm8_r8);
* assert.equal(instr.mnemonic, Mnemonic.Xchg);
* assert.equal(instr.length, 4);
*
* decoder.decodeOut(instr);
* assert.equal(instr.code, Code.Add_rm32_imm8);
* assert.equal(instr.mnemonic, Mnemonic.Add);
* assert.equal(instr.length, 5);
*
* decoder.decodeOut(instr);
* assert.equal(instr.code, Code.EVEX_Vmovdqu64_zmm_k1z_zmmm512);
* assert.equal(instr.mnemonic, Mnemonic.Vmovdqu64);
* assert.equal(instr.length, 6);
*
* // Free wasm memory
* decoder.free();
* instr.free();
* ```
*
* It's sometimes useful to decode some invalid instructions, eg. `lock add esi,ecx`.
* Pass in [`DecoderOptions.NoInvalidCheck`] to the constructor and the decoder
* will decode some invalid encodings.
*
* [`DecoderOptions.NoInvalidCheck`]: enum.DecoderOptions.html#variant.NoInvalidCheck
*
* ```js
* const assert = require("assert").strict;
* const { Code, Decoder, DecoderOptions } = require("iced-x86");
*
* // lock add esi,ecx   ; lock not allowed
* const bytes = new Uint8Array([0xF0, 0x01, 0xCE]);
* const decoder1 = new Decoder(64, bytes, DecoderOptions.None);
* decoder1.ip = 0x12345678n;
* const instr1 = decoder1.decode();
* assert.equal(instr1.code, Code.INVALID);
*
* // We want to decode some instructions with invalid encodings
* const decoder2 = new Decoder(64, bytes, DecoderOptions.NoInvalidCheck);
* decoder2.ip = 0x12345678n;
* const instr2 = decoder2.decode();
* assert.equal(instr2.code, Code.Add_rm32_r32);
* assert.ok(instr2.hasLockPrefix);
*
* // Free wasm memory
* decoder1.free();
* decoder2.free();
* instr1.free();
* instr2.free();
* ```
* @param {number} bitness
* @param {Uint8Array} data
* @param {number} options
*/
  constructor(bitness: number, data: Uint8Array, options: number);
/**
* Decodes all instructions and returns an array of [`Instruction`]s
*
* [`Instruction`]: struct.Instruction.html
* @returns {Array<any>}
*/
  decodeAll(): Array<any>;
/**
* Decodes at most `count` instructions and returns an array of [`Instruction`]s.
* It returns less than `count` instructions if there's not enough data left to decode.
*
* [`Instruction`]: struct.Instruction.html
*
* # Arguments
*
* - `count`: Max number of instructions to decode
* @param {number} count
* @returns {Array<any>}
*/
  decodeInstructions(count: number): Array<any>;
/**
* Decodes and returns the next instruction, see also [`decodeOut()`]
* which avoids allocating a new instruction.
* See also [`lastError`].
*
* [`decodeOut()`]: #method.decode_out
* [`lastError`]: #method.last_error
*
* # Examples
*
* ```js
* const assert = require("assert").strict;
* const { Code, Decoder, DecoderOptions, MemorySize, Mnemonic, OpKind, Register } = require("iced-x86");
*
* // xrelease lock add [rax],ebx
* const bytes = new Uint8Array([0xF0, 0xF3, 0x01, 0x18]);
* const decoder = new Decoder(64, bytes, DecoderOptions.None);
* decoder.ip = 0x12345678n;
* const instr = decoder.decode();
*
* assert.equal(instr.code, Code.Add_rm32_r32);
* assert.equal(instr.mnemonic, Mnemonic.Add);
* assert.equal(instr.length, 4);
* assert.equal(instr.opCount, 2);
*
* assert.equal(instr.op0Kind, OpKind.Memory);
* assert.equal(instr.memoryBase, Register.RAX);
* assert.equal(instr.memoryIndex, Register.None);
* assert.equal(instr.memoryIndexScale, 1);
* assert.equal(instr.memoryDisplacement, 0);
* assert.equal(instr.memorySegment, Register.DS);
* assert.equal(instr.segmentPrefix, Register.None);
* assert.equal(instr.memorySize, MemorySize.UInt32);
*
* assert.equal(instr.op1Kind, OpKind.Register);
* assert.equal(instr.op1Register, Register.EBX);
*
* assert.ok(instr.hasLockPrefix);
* assert.ok(instr.hasXreleasePrefix);
*
* // Free wasm memory
* decoder.free();
* instr.free();
* ```
* @returns {Instruction}
*/
  decode(): Instruction;
/**
* Decodes the next instruction. The difference between this method and [`decode()`] is that this
* method doesn't need to allocate a new instruction.
* See also [`lastError`].
*
* [`decode()`]: #method.decode
* [`lastError`]: #method.last_error
*
* # Arguments
*
* * `instruction`: Updated with the decoded instruction. All fields are initialized (it's an `out` argument)
*
* # Examples
*
* ```js
* const assert = require("assert").strict;
* const { Code, Decoder, DecoderOptions, Instruction, MemorySize, Mnemonic, OpKind, Register } = require("iced-x86");
*
* // xrelease lock add [rax],ebx
* const bytes = new Uint8Array([0xF0, 0xF3, 0x01, 0x18]);
* const decoder = new Decoder(64, bytes, DecoderOptions.None);
* decoder.ip = 0x12345678n;
* const instr = new Instruction();
* decoder.decodeOut(instr);
*
* assert.equal(instr.code, Code.Add_rm32_r32);
* assert.equal(instr.mnemonic, Mnemonic.Add);
* assert.equal(instr.length, 4);
* assert.equal(instr.opCount, 2);
*
* assert.equal(instr.op0Kind, OpKind.Memory);
* assert.equal(instr.memoryBase, Register.RAX);
* assert.equal(instr.memoryIndex, Register.None);
* assert.equal(instr.memoryIndexScale, 1);
* assert.equal(instr.memoryDisplacement, 0);
* assert.equal(instr.memorySegment, Register.DS);
* assert.equal(instr.segmentPrefix, Register.None);
* assert.equal(instr.memorySize, MemorySize.UInt32);
*
* assert.equal(instr.op1Kind, OpKind.Register);
* assert.equal(instr.op1Register, Register.EBX);
*
* assert.ok(instr.hasLockPrefix);
* assert.ok(instr.hasXreleasePrefix);
*
* // Free wasm memory
* decoder.free();
* instr.free();
* ```
* @param {Instruction} instruction
*/
  decodeOut(instruction: Instruction): void;
/**
* Gets the offsets of the constants (memory displacement and immediate) in the decoded instruction.
* The caller can check if there are any relocations at those addresses.
*
* # Arguments
*
* * `instruction`: The latest instruction that was decoded by this decoder
*
* # Examples
*
* ```js
* const assert = require("assert").strict;
* const { Code, Decoder, DecoderOptions } = require("iced-x86");
*
* // nop
* // xor dword ptr [rax-5AA5EDCCh],5Ah
* const bytes = new Uint8Array(
*     //     00    01    02    03    04    05    06
*     //     opc   modrm displacement__________  imm
*     [0x90, 0x83, 0xB3, 0x34, 0x12, 0x5A, 0xA5, 0x5A]);
* const decoder = new Decoder(64, bytes, DecoderOptions.None);
* decoder.ip = 0x12345678n;
* const instr = decoder.decode();
* assert.equal(instr.code, Code.Nopd);
* decoder.decodeOut(instr);
* const co = decoder.getConstantOffsets(instr);
*
* assert.ok(co.hasDisplacement);
* assert.equal(co.displacementOffset, 2);
* assert.equal(co.displacementSize, 4);
* assert.ok(co.hasImmediate);
* assert.equal(co.immediateOffset, 6);
* assert.equal(co.immediateSize, 1);
* // It's not an instruction with two immediates (e.g. enter)
* assert.ok(!co.hasImmediate2);
* assert.equal(co.immediateOffset2, 0);
* assert.equal(co.immediateSize2, 0);
*
* // Free wasm memory
* decoder.free();
* instr.free();
* co.free();
* ```
* @param {Instruction} instruction
* @returns {ConstantOffsets}
*/
  getConstantOffsets(instruction: Instruction): ConstantOffsets;
/**
* Gets the bitness (16, 32 or 64)
*/
  readonly bitness: number;
/**
* Returns `true` if there's at least one more byte to decode. It doesn't verify that the
* next instruction is valid, it only checks if there's at least one more byte to read.
* See also [`position`] and [`maxPosition`]
*
* It's not required to call this method. If this method returns `false`, then [`decodeOut()`]
* and [`decode()`] will return an instruction whose [`code`] == [`Code.INVALID`].
*
* [`position`]: #method.position
* [`maxPosition`]: #method.max_position
* [`decodeOut()`]: #method.decode_out
* [`decode()`]: #method.decode
* [`code`]: struct.Instruction.html#method.code
* [`Code.INVALID`]: enum.Code.html#variant.INVALID
*
* # Examples
*
* ```js
* const assert = require("assert").strict;
* const { Code, Decoder, DecoderOptions } = require("iced-x86");
*
* // nop and an incomplete instruction
* const bytes = new Uint8Array([0x90, 0xF3, 0x0F]);
* const decoder = new Decoder(64, bytes, DecoderOptions.None);
* decoder.ip = 0x12345678n;
*
* // 3 bytes left to read
* assert.ok(decoder.canDecode);
* const instr = decoder.decode();
* assert.equal(instr.code, Code.Nopd);
*
* // 2 bytes left to read
* assert.ok(decoder.canDecode);
* decoder.decodeOut(instr);
* // Not enough bytes left to decode a full instruction
* assert.equal(instr.code, Code.INVALID);
*
* // 0 bytes left to read
* assert.ok(!decoder.canDecode);
*
* // Free wasm memory
* decoder.free();
* instr.free();
* ```
*/
  readonly canDecode: boolean;
/**
* Gets the current `IP`/`EIP`/`RIP` value, see also [`position`]
*
* [`position`]: #method.position
*/
  ip: bigint;
/**
* Gets the last decoder error. Unless you need to know the reason it failed,
* it's better to check [`instruction.isInvalid()`].
*
* It returns a [`DecoderError`] enum value.
*
* [`instruction.isInvalid()`]: struct.Instruction.html#method.is_invalid
* [`DecoderError`]: enum.DecoderError.html
*/
  readonly lastError: DecoderError;
/**
* Gets the max value that can be written to [`position`]. This is the size of the data that gets
* decoded to instructions and it's the length of the array that was passed to the constructor.
*
* [`position`]: #method.set_position
*/
  readonly maxPosition: number;
/**
* Gets the current data position. This value is always <= [`maxPosition`].
* When [`position`] == [`maxPosition`], it's not possible to decode more
* instructions and [`canDecode`] returns `false`.
*
* [`maxPosition`]: #method.max_position
* [`position`]: #method.position
* [`canDecode`]: #method.can_decode
*/
  position: number;
}
/**
* Encodes instructions decoded by the decoder or instructions created by other code.
* See also [`BlockEncoder`] which can encode any number of instructions.
*
* [`BlockEncoder`]: struct.BlockEncoder.html
*
* ```js
* const assert = require("assert").strict;
* const { Decoder, DecoderOptions, Encoder } = require("iced-x86");
*
* // xchg ah,[rdx+rsi+16h]
* const bytes = new Uint8Array([0x86, 0x64, 0x32, 0x16]);
* const decoder = new Decoder(64, bytes, DecoderOptions.None);
* decoder.ip = 0x12345678n;
* const instr = decoder.decode();
*
* const encoder = new Encoder(64);
* const len = encoder.encode(instr, 0x55555555n);
* assert.equal(len, 4);
* // We're done, take ownership of the buffer
* const buffer = encoder.takeBuffer();
* assert.equal(buffer.length, 4);
* assert.equal(buffer[0], 0x86);
* assert.equal(buffer[1], 0x64);
* assert.equal(buffer[2], 0x32);
* assert.equal(buffer[3], 0x16);
*
* // Free wasm memory
* decoder.free();
* instr.free();
* encoder.free();
* ```
*/
export class Encoder {
  free(): void;
/**
* Creates an encoder
*
* # Throws
*
* Throws if `bitness` is not one of 16, 32, 64.
*
* # Arguments
*
* * `bitness`: 16, 32 or 64
* @param {number} bitness
*/
  constructor(bitness: number);
/**
* Creates an encoder with an initial buffer capacity
*
* # Throws
*
* Throws if `bitness` is not one of 16, 32, 64.
*
* # Arguments
*
* * `bitness`: 16, 32 or 64
* * `capacity`: Initial capacity of the `u8` buffer
* @param {number} bitness
* @param {number} capacity
* @returns {Encoder}
*/
  static withCapacity(bitness: number, capacity: number): Encoder;
/**
* Encodes an instruction and returns the size of the encoded instruction
*
* # Throws
*
* Throws an error on failure.
*
* # Arguments
*
* * `instruction`: Instruction to encode
* * `rip`: `RIP` of the encoded instruction
*
* # Examples
*
* ```js
* const assert = require("assert").strict;
* const { Decoder, DecoderOptions, Encoder } = require("iced-x86");
*
* // je short $+4
* const bytes = new Uint8Array([0x75, 0x02]);
* const decoder = new Decoder(64, bytes, DecoderOptions.None);
* decoder.ip = 0x12345678n;
* const instr = decoder.decode();
*
* const encoder = new Encoder(64);
* // Use a different IP (orig rip + 0x10)
* const len = encoder.encode(instr, 0x12345688n);
* assert.equal(len, 2);
* // We're done, take ownership of the buffer
* const buffer = encoder.takeBuffer();
* assert.equal(buffer.length, 2);
* assert.equal(buffer[0], 0x75);
* assert.equal(buffer[1], 0xF2);
*
* // Free wasm memory
* decoder.free();
* encoder.free();
* instr.free();
* ```
* @param {Instruction} instruction
* @param {bigint} rip
* @returns {number}
*/
  encode(instruction: Instruction, rip: bigint): number;
/**
* Writes a byte to the output buffer
*
* # Arguments
*
* `value`: Value to write
*
* # Examples
*
* ```js
* const assert = require("assert").strict;
* const { Code, Encoder, Instruction, Register } = require("iced-x86");
*
* const encoder = new Encoder(64);
* const instr = Instruction.createRegReg(Code.Add_r64_rm64, Register.R8, Register.RBP);
* encoder.writeU8(0x90);
* const len = encoder.encode(instr, 0x55555555n);
* assert.equal(len, 3);
* encoder.writeU8(0xCC);
* // We're done, take ownership of the buffer
* const buffer = encoder.takeBuffer();
* assert.equal(buffer.length, 5);
* assert.equal(buffer[0], 0x90);
* assert.equal(buffer[1], 0x4C);
* assert.equal(buffer[2], 0x03);
* assert.equal(buffer[3], 0xC5);
* assert.equal(buffer[4], 0xCC);
*
* // Free wasm memory
* encoder.free();
* instr.free();
* ```
* @param {number} value
*/
  writeU8(value: number): void;
/**
* Returns the buffer and initializes the internal buffer to an empty vector. Should be called when
* you've encoded all instructions and need the raw instruction bytes. See also [`setBuffer()`].
*
* [`setBuffer()`]: #method.set_buffer
* @returns {Uint8Array}
*/
  takeBuffer(): Uint8Array;
/**
* Overwrites the buffer with a new vector. The old buffer is dropped. See also [`takeBuffer()`].
*
* [`takeBuffer()`]: #method.take_buffer
* @param {Uint8Array} buffer
*/
  setBuffer(buffer: Uint8Array): void;
/**
* Gets the offsets of the constants (memory displacement and immediate) in the encoded instruction.
* The caller can use this information to add relocations if needed.
* @returns {ConstantOffsets}
*/
  getConstantOffsets(): ConstantOffsets;
/**
* Value of the `EVEX.L'L` bits to use if it's an instruction that ignores the bits. Default is 0.
*/
  EVEX_LIG: number;
/**
* Value of the `EVEX.W` bit to use if it's an instruction that ignores the bit. Default is 0.
*/
  EVEX_WIG: number;
/**
* Value of the `MVEX.W` bit to use if it's an instruction that ignores the bit. Default is 0.
*/
  MVEX_WIG: number;
/**
* Value of the `VEX.L` bit to use if it's an instruction that ignores the bit. Default is 0.
*/
  VEX_LIG: number;
/**
* Value of the `VEX.W` bit to use if it's an instruction that ignores the bit. Default is 0.
*/
  VEX_WIG: number;
/**
* Gets the bitness (16, 32 or 64)
*/
  readonly bitness: number;
/**
* Disables 2-byte VEX encoding and encodes all VEX instructions with the 3-byte VEX encoding
*/
  preventVEX2: boolean;
}
/**
* x86 formatter that uses less code (smaller wasm files)
*/
export class FastFormatter {
  free(): void;
/**
* Creates an x86 formatter
*
* # Examples
*
* ```js
* const assert = require("assert").strict;
* const { Decoder, DecoderOptions, FastFormatter } = require("iced-x86");
*
* const bytes = new Uint8Array([0x62, 0xF2, 0x4F, 0xDD, 0x72, 0x50, 0x01]);
* const decoder = new Decoder(64, bytes, DecoderOptions.None);
* const instr = decoder.decode();
*
* const formatter = new FastFormatter();
* formatter.spaceAfterOperandSeparator = true;
* const disasm = formatter.format(instr);
* assert.equal(disasm, "vcvtne2ps2bf16 zmm2{k5}{z}, zmm6, dword bcst [rax+4h]");
*
* // Free wasm memory
* decoder.free();
* instr.free();
* formatter.free();
* ```
*
* [`FormatterSyntax`]: enum.FormatterSyntax.html
*/
  constructor();
/**
* Formats the whole instruction: prefixes, mnemonic, operands
*
* # Arguments
*
* - `instruction`: Instruction
* @param {Instruction} instruction
* @returns {string}
*/
  format(instruction: Instruction): string;
/**
* Always show the size of memory operands
*
* Default | Value | Example | Example
* --------|-------|---------|--------
* _ | `true` | `mov eax,dword ptr [ebx]` | `add byte ptr [eax],0x12`
* 👍 | `false` | `mov eax,[ebx]` | `add byte ptr [eax],0x12`
*/
  alwaysShowMemorySize: boolean;
/**
* Always show the effective segment register. If the option is `false`, only show the segment register if
* there's a segment override prefix.
*
* Default | Value | Example
* --------|-------|--------
* _ | `true` | `mov eax,ds:[ecx]`
* 👍 | `false` | `mov eax,[ecx]`
*/
  alwaysShowSegmentRegister: boolean;
/**
* Show `RIP+displ` or the virtual address
*
* Default | Value | Example
* --------|-------|--------
* _ | `true` | `mov eax,[rip+12345678h]`
* 👍 | `false` | `mov eax,[1029384756AFBECDh]`
*/
  ripRelativeAddresses: boolean;
/**
* Show the original value after the symbol name
*
* Default | Value | Example
* --------|-------|--------
* _ | `true` | `mov eax,[myfield (12345678)]`
* 👍 | `false` | `mov eax,[myfield]`
*/
  showSymbolAddress: boolean;
/**
* Add a space after the operand separator
*
* Default | Value | Example
* --------|-------|--------
* _ | `true` | `mov rax, rcx`
* 👍 | `false` | `mov rax,rcx`
*/
  spaceAfterOperandSeparator: boolean;
/**
* Use uppercase hex digits
*
* Default | Value | Example
* --------|-------|--------
* 👍 | `true` | `0xFF`
* _ | `false` | `0xff`
*/
  uppercaseHex: boolean;
/**
* Use a hex prefix (`0x`) or a hex suffix (`h`)
*
* Default | Value | Example
* --------|-------|--------
* _ | `true` | `0x5A`
* 👍 | `false` | `5Ah`
*/
  useHexPrefix: boolean;
/**
* Use pseudo instructions
*
* Default | Value | Example
* --------|-------|--------
* 👍 | `true` | `vcmpnltsd xmm2,xmm6,xmm3`
* _ | `false` | `vcmpsd xmm2,xmm6,xmm3,5`
*/
  usePseudoOps: boolean;
}
/**
* x86 formatter that supports GNU Assembler, Intel XED, masm and nasm syntax
*/
export class Formatter {
  free(): void;
/**
* Creates an x86 formatter
*
* # Arguments
*
* * `syntax`: Formatter syntax, see [`FormatterSyntax`]
*
* # Examples
*
* ```js
* const assert = require("assert").strict;
* const { Decoder, DecoderOptions, Formatter, FormatterSyntax } = require("iced-x86");
*
* const bytes = new Uint8Array([0x62, 0xF2, 0x4F, 0xDD, 0x72, 0x50, 0x01]);
* const decoder = new Decoder(64, bytes, DecoderOptions.None);
* const instr = decoder.decode();
*
* const formatter = new Formatter(FormatterSyntax.Masm);
* formatter.uppercaseMnemonics = true;
* const disasm = formatter.format(instr);
* assert.equal(disasm, "VCVTNE2PS2BF16 zmm2{k5}{z},zmm6,dword bcst [rax+4]");
*
* // Free wasm memory
* decoder.free();
* instr.free();
* formatter.free();
* ```
*
* [`FormatterSyntax`]: enum.FormatterSyntax.html
* @param {FormatterSyntax} syntax
*/
  constructor(syntax: FormatterSyntax);
/**
* Formats the whole instruction: prefixes, mnemonic, operands
*
* # Arguments
*
* - `instruction`: Instruction
* @param {Instruction} instruction
* @returns {string}
*/
  format(instruction: Instruction): string;
/**
* Formats the mnemonic and any prefixes
*
* # Arguments
*
* - `instruction`: Instruction
* @param {Instruction} instruction
* @returns {string}
*/
  formatMnemonic(instruction: Instruction): string;
/**
* Formats the mnemonic and/or any prefixes
*
* # Arguments
*
* - `instruction`: Instruction
* - `options`: Options, see [`FormatMnemonicOptions`]
*
* [`FormatMnemonicOptions`]: enum.FormatMnemonicOptions.html
* @param {Instruction} instruction
* @param {number} options
* @returns {string}
*/
  formatMnemonicOptions(instruction: Instruction, options: number): string;
/**
* Gets the number of operands that will be formatted. A formatter can add and remove operands
*
* # Arguments
*
* - `instruction`: Instruction
* @param {Instruction} instruction
* @returns {number}
*/
  operandCount(instruction: Instruction): number;
/**
* Returns the operand access ([`OpAccess`]) but only if it's an operand added by the formatter. If it's an
* operand that is part of [`Instruction`], you should call eg. [`InstructionInfoFactory.info()`].
*
* # Throws
*
* Throws if `operand` is invalid
*
* # Arguments
*
* - `instruction`: Instruction
* - `operand`: Operand number, 0-based. This is a formatter operand and isn't necessarily the same as an instruction operand. See [`operandCount`]
*
* [`OpAccess`]: enum.OpAccess.html
* [`Instruction`]: struct.Instruction.html
* [`InstructionInfoFactory.info()`]: struct.InstructionInfoFactory.html#method.info
* [`operandCount`]: #method.operand_count
* @param {Instruction} instruction
* @param {number} operand
* @returns {OpAccess | undefined}
*/
  opAccess(instruction: Instruction, operand: number): OpAccess | undefined;
/**
* Converts a formatter operand index to an instruction operand index. Returns `undefined` if it's an operand added by the formatter
*
* # Throws
*
* Throws if `operand` is invalid
*
* # Arguments
*
* - `instruction`: Instruction
* - `operand`: Operand number, 0-based. This is a formatter operand and isn't necessarily the same as an instruction operand. See [`operandCount`]
*
* [`operandCount`]: #method.operand_count
* @param {Instruction} instruction
* @param {number} operand
* @returns {number | undefined}
*/
  getInstructionOperand(instruction: Instruction, operand: number): number | undefined;
/**
* Converts an instruction operand index to a formatter operand index. Returns `undefined` if the instruction operand isn't used by the formatter
*
* # Throws
*
* Throws if `instructionOperand` is invalid
*
* # Arguments
*
* - `instruction`: Instruction
* - `instructionOperand`: Instruction operand
* @param {Instruction} instruction
* @param {number} instructionOperand
* @returns {number | undefined}
*/
  getFormatterOperand(instruction: Instruction, instructionOperand: number): number | undefined;
/**
* Formats an operand. This is a formatter operand and not necessarily a real instruction operand.
* A formatter can add and remove operands.
*
* # Throws
*
* Throws if `operand` is invalid
*
* # Arguments
*
* - `instruction`: Instruction
* - `operand`: Operand number, 0-based. This is a formatter operand and isn't necessarily the same as an instruction operand. See [`operandCount`]
*
* [`operandCount`]: #method.operand_count
* @param {Instruction} instruction
* @param {number} operand
* @returns {string}
*/
  formatOperand(instruction: Instruction, operand: number): string;
/**
* Formats an operand separator
*
* # Arguments
*
* - `instruction`: Instruction
* @param {Instruction} instruction
* @returns {string}
*/
  formatOperandSeparator(instruction: Instruction): string;
/**
* Formats all operands
*
* # Arguments
*
* - `instruction`: Instruction
* @param {Instruction} instruction
* @returns {string}
*/
  formatAllOperands(instruction: Instruction): string;
/**
* Formats a register
*
* # Arguments
*
* - `register`: Register (a [`Register`] enum value)
*
* [`Register`]: enum.Register.html
* @param {Register} register
* @returns {string}
*/
  formatRegister(register: Register): string;
/**
* Formats a `i8`
*
* # Arguments
*
* - `value`: Value
* @param {number} value
* @returns {string}
*/
  formatI8(value: number): string;
/**
* Formats a `i16`
*
* # Arguments
*
* - `value`: Value
* @param {number} value
* @returns {string}
*/
  formatI16(value: number): string;
/**
* Formats a `i32`
*
* # Arguments
*
* - `value`: Value
* @param {number} value
* @returns {string}
*/
  formatI32(value: number): string;
/**
* Formats a `i64`
*
* # Arguments
*
* - `value`: Value
* @param {bigint} value
* @returns {string}
*/
  formatI64(value: bigint): string;
/**
* Formats a `u8`
*
* # Arguments
*
* - `value`: Value
* @param {number} value
* @returns {string}
*/
  formatU8(value: number): string;
/**
* Formats a `u16`
*
* # Arguments
*
* - `value`: Value
* @param {number} value
* @returns {string}
*/
  formatU16(value: number): string;
/**
* Formats a `u32`
*
* # Arguments
*
* - `value`: Value
* @param {number} value
* @returns {string}
*/
  formatU32(value: number): string;
/**
* Formats a `u64`
*
* # Arguments
*
* - `value`: Value
* @param {bigint} value
* @returns {string}
*/
  formatU64(value: bigint): string;
/**
* Add a leading zero to hex numbers if there's no prefix and the number starts with hex digits `A-F`
*
* Default | Value | Example
* --------|-------|--------
* 👍 | `true` | `0FFh`
* _ | `false` | `FFh`
*/
  addLeadingZeroToHexNumbers: boolean;
/**
* Always show the scale value even if it's `*1`
*
* Default | Value | Example
* --------|-------|--------
* _ | `true` | `mov eax,[rbx+rcx*1]`
* 👍 | `false` | `mov eax,[rbx+rcx]`
*/
  alwaysShowScale: boolean;
/**
* Always show the effective segment register. If the option is `false`, only show the segment register if
* there's a segment override prefix.
*
* Default | Value | Example
* --------|-------|--------
* _ | `true` | `mov eax,ds:[ecx]`
* 👍 | `false` | `mov eax,[ecx]`
*/
  alwaysShowSegmentRegister: boolean;
/**
* Size of a digit group, see also [`digitSeparator`]
*
* [`digitSeparator`]: #method.digit_separator
*
* Default | Value | Example
* --------|-------|--------
* _ | `0` | `11010111`
* 👍 | `4` | `1101_0111`
*/
  binaryDigitGroupSize: number;
/**
* Binary number prefix or an empty string
*
* - Default: `""` (masm/nasm/intel), `"0b"` (gas)
*/
  binaryPrefix: string;
/**
* Binary number suffix or an empty string
*
* - Default: `"b"` (masm/nasm/intel), `""` (gas)
*/
  binarySuffix: string;
/**
* Add leading zeros to branch offsets. Used by `CALL NEAR`, `CALL FAR`, `JMP NEAR`, `JMP FAR`, `Jcc`, `LOOP`, `LOOPcc`, `XBEGIN`
*
* Default | Value | Example
* --------|-------|--------
* 👍 | `true` | `je 00000123h`
* _ | `false` | `je 123h`
*/
  branchLeadingZeros: boolean;
/**
* Mnemonic condition code selector (eg. `JA` / `JNBE`)
*
* The value is a [`CC_a`] enum value.
*
* [`CC_a`]: enum.CC_a.html
*
* Default: `JA`, `CMOVA`, `SETA`
*/
  cc_a: CC_a;
/**
* Mnemonic condition code selector (eg. `JAE` / `JNB` / `JNC`)
*
* The value is a [`CC_ae`] enum value.
*
* [`CC_ae`]: enum.CC_ae.html
*
* Default: `JAE`, `CMOVAE`, `SETAE`
*/
  cc_ae: CC_ae;
/**
* Mnemonic condition code selector (eg. `JB` / `JC` / `JNAE`)
*
* The value is a [`CC_b`] enum value.
*
* [`CC_b`]: enum.CC_b.html
*
* Default: `JB`, `CMOVB`, `SETB`
*/
  cc_b: CC_b;
/**
* Mnemonic condition code selector (eg. `JBE` / `JNA`)
*
* The value is a [`CC_be`] enum value.
*
* [`CC_be`]: enum.CC_be.html
*
* Default: `JBE`, `CMOVBE`, `SETBE`
*/
  cc_be: CC_be;
/**
* Mnemonic condition code selector (eg. `JE` / `JZ`)
*
* The value is a [`CC_e`] enum value.
*
* [`CC_e`]: enum.CC_e.html
*
* Default: `JE`, `CMOVE`, `SETE`, `LOOPE`, `REPE`
*/
  cc_e: CC_e;
/**
* Mnemonic condition code selector (eg. `JG` / `JNLE`)
*
* The value is a [`CC_g`] enum value.
*
* [`CC_g`]: enum.CC_g.html
*
* Default: `JG`, `CMOVG`, `SETG`
*/
  cc_g: CC_g;
/**
* Mnemonic condition code selector (eg. `JGE` / `JNL`)
*
* The value is a [`CC_ge`] enum value.
*
* [`CC_ge`]: enum.CC_ge.html
*
* Default: `JGE`, `CMOVGE`, `SETGE`
*/
  cc_ge: CC_ge;
/**
* Mnemonic condition code selector (eg. `JL` / `JNGE`)
*
* The value is a [`CC_l`] enum value.
*
* [`CC_l`]: enum.CC_l.html
*
* Default: `JL`, `CMOVL`, `SETL`
*/
  cc_l: CC_l;
/**
* Mnemonic condition code selector (eg. `JLE` / `JNG`)
*
* The value is a [`CC_le`] enum value.
*
* [`CC_le`]: enum.CC_le.html
*
* Default: `JLE`, `CMOVLE`, `SETLE`
*/
  cc_le: CC_le;
/**
* Mnemonic condition code selector (eg. `JNE` / `JNZ`)
*
* The value is a [`CC_ne`] enum value.
*
* [`CC_ne`]: enum.CC_ne.html
*
* Default: `JNE`, `CMOVNE`, `SETNE`, `LOOPNE`, `REPNE`
*/
  cc_ne: CC_ne;
/**
* Mnemonic condition code selector (eg. `JNP` / `JPO`)
*
* The value is a [`CC_np`] enum value.
*
* [`CC_np`]: enum.CC_np.html
*
* Default: `JNP`, `CMOVNP`, `SETNP`
*/
  cc_np: CC_np;
/**
* Mnemonic condition code selector (eg. `JP` / `JPE`)
*
* The value is a [`CC_p`] enum value.
*
* [`CC_p`]: enum.CC_p.html
*
* Default: `JP`, `CMOVP`, `SETP`
*/
  cc_p: CC_p;
/**
* Size of a digit group, see also [`digitSeparator`]
*
* [`digitSeparator`]: #method.digit_separator
*
* Default | Value | Example
* --------|-------|--------
* _ | `0` | `12345678`
* 👍 | `3` | `12_345_678`
*/
  decimalDigitGroupSize: number;
/**
* Decimal number prefix or an empty string
*
* - Default: `""`
*/
  decimalPrefix: string;
/**
* Decimal number suffix or an empty string
*
* - Default: `""`
*/
  decimalSuffix: string;
/**
* Digit separator or an empty string. See also eg. [`hexDigitGroupSize`]
*
* [`hexDigitGroupSize`]: #method.hex_digit_group_size
*
* Default | Value | Example
* --------|-------|--------
* 👍 | `""` | `0x12345678`
* _ | `"_"` | `0x1234_5678`
*/
  digitSeparator: string;
/**
* Add leading zeros to displacements
*
* Default | Value | Example
* --------|-------|--------
* _ | `true` | `mov al,[eax+00000012h]`
* 👍 | `false` | `mov al,[eax+12h]`
*/
  displacementLeadingZeros: boolean;
/**
* Character index (0-based) where the first operand is formatted. Can be set to 0 to format it immediately after the mnemonic.
* At least one space or tab is always added between the mnemonic and the first operand.
*
* Default | Value | Example
* --------|-------|--------
* 👍 | `0` | `mov•rcx,rbp`
* _ | `8` | `mov•••••rcx,rbp`
*/
  firstOperandCharIndex: number;
/**
* (gas only): If `true`, the formatter doesn't add `%` to registers
*
* Default | Value | Example
* --------|-------|--------
* _ | `true` | `mov eax,ecx`
* 👍 | `false` | `mov %eax,%ecx`
*/
  gasNakedRegisters: boolean;
/**
* (gas only): Shows the mnemonic size suffix even when not needed
*
* Default | Value | Example
* --------|-------|--------
* _ | `true` | `movl %eax,%ecx`
* 👍 | `false` | `mov %eax,%ecx`
*/
  gasShowMnemonicSizeSuffix: boolean;
/**
* (gas only): Add a space after the comma if it's a memory operand
*
* Default | Value | Example
* --------|-------|--------
* _ | `true` | `(%eax, %ecx, 2)`
* 👍 | `false` | `(%eax,%ecx,2)`
*/
  gasSpaceAfterMemoryOperandComma: boolean;
/**
* Size of a digit group, see also [`digitSeparator`]
*
* [`digitSeparator`]: #method.digit_separator
*
* Default | Value | Example
* --------|-------|--------
* _ | `0` | `0x12345678`
* 👍 | `4` | `0x1234_5678`
*/
  hexDigitGroupSize: number;
/**
* Hex number prefix or an empty string, eg. `"0x"`
*
* - Default: `""` (masm/nasm/intel), `"0x"` (gas)
*/
  hexPrefix: string;
/**
* Hex number suffix or an empty string, eg. `"h"`
*
* - Default: `"h"` (masm/nasm/intel), `""` (gas)
*/
  hexSuffix: string;
/**
* Add leading zeros to hexadecimal/octal/binary numbers.
* This option has no effect on branch targets and displacements, use [`branchLeadingZeros`]
* and [`displacementLeadingZeros`].
*
* Default | Value | Example
* --------|-------|--------
* _ | `true` | `0x0000000A`/`0000000Ah`
* 👍 | `false` | `0xA`/`0Ah`
*
* [`branchLeadingZeros`]: #method.branch_leading_zeros
* [`displacementLeadingZeros`]: #method.displacement_leading_zeros
*/
  leadingZeros: boolean;
/**
* (masm only): Add a `DS` segment override even if it's not present. Used if it's 16/32-bit code and mem op is a displ
*
* Default | Value | Example
* --------|-------|--------
* 👍 | `true` | `mov eax,ds:[12345678]`
* _ | `false` | `mov eax,[12345678]`
*/
  masmAddDsPrefix32: boolean;
/**
* (masm only): Show displacements in brackets
*
* Default | Value | Example
* --------|-------|--------
* 👍 | `true` | `[ecx+1234h]`
* _ | `false` | `1234h[ecx]`
*/
  masmDisplInBrackets: boolean;
/**
* (masm only): Show symbols in brackets
*
* Default | Value | Example
* --------|-------|--------
* 👍 | `true` | `[ecx+symbol]` / `[symbol]`
* _ | `false` | `symbol[ecx]` / `symbol`
*/
  masmSymbolDisplInBrackets: boolean;
/**
* Options (a [`MemorySizeOptions`] flags value) that control if the memory size (eg. `DWORD PTR`) is shown or not.
* This is ignored by the gas (AT&T) formatter.
*
* - Default: [`Default`]
*
* [`MemorySizeOptions`]: enum.MemorySizeOptions.html
* [`Default`]: enum.MemorySizeOptions.html#variant.Default
*/
  memorySizeOptions: MemorySizeOptions;
/**
* (nasm only): Shows `BYTE`, `WORD`, `DWORD` or `QWORD` if it's a sign extended immediate operand value
*
* Default | Value | Example
* --------|-------|--------
* _ | `true` | `or rcx,byte -1`
* 👍 | `false` | `or rcx,-1`
*/
  nasmShowSignExtendedImmediateSize: boolean;
/**
* Number base (`2`, `8`, `10`, `16`)
*
* - Default: `16`
*/
  numberBase: number;
/**
* Size of a digit group, see also [`digitSeparator`]
*
* [`digitSeparator`]: #method.digit_separator
*
* Default | Value | Example
* --------|-------|--------
* _ | `0` | `12345670`
* 👍 | `4` | `1234_5670`
*/
  octalDigitGroupSize: number;
/**
* Octal number prefix or an empty string
*
* - Default: `""` (masm/nasm/intel), `"0"` (gas)
*/
  octalPrefix: string;
/**
* Octal number suffix or an empty string
*
* - Default: `"o"` (masm/nasm/intel), `""` (gas)
*/
  octalSuffix: string;
/**
* Use `st(0)` instead of `st` if `st` can be used. Ignored by the nasm formatter.
*
* Default | Value | Example
* --------|-------|--------
* _ | `true` | `fadd st(0),st(3)`
* 👍 | `false` | `fadd st,st(3)`
*/
  preferSt0: boolean;
/**
* Show `RIP+displ` or the virtual address
*
* Default | Value | Example
* --------|-------|--------
* _ | `true` | `mov eax,[rip+12345678h]`
* 👍 | `false` | `mov eax,[1029384756AFBECDh]`
*/
  ripRelativeAddresses: boolean;
/**
* Show memory operand scale value before the index register
*
* Default | Value | Example
* --------|-------|--------
* _ | `true` | `mov eax,[8*rdx]`
* 👍 | `false` | `mov eax,[rdx*8]`
*/
  scaleBeforeIndex: boolean;
/**
* Show `NEAR`, `SHORT`, etc if it's a branch instruction
*
* Default | Value | Example
* --------|-------|--------
* 👍 | `true` | `je short 1234h`
* _ | `false` | `je 1234h`
*/
  showBranchSize: boolean;
/**
* Show the original value after the symbol name
*
* Default | Value | Example
* --------|-------|--------
* _ | `true` | `mov eax,[myfield (12345678)]`
* 👍 | `false` | `mov eax,[myfield]`
*/
  showSymbolAddress: boolean;
/**
* Show useless prefixes. If it has useless prefixes, it could be data and not code.
*
* Default | Value | Example
* --------|-------|--------
* _ | `true` | `es rep add eax,ecx`
* 👍 | `false` | `add eax,ecx`
*/
  showUselessPrefixes: boolean;
/**
* Show zero displacements
*
* Default | Value | Example
* --------|-------|--------
* _ | `true` | `mov eax,[rcx*2+0]`
* 👍 | `false` | `mov eax,[rcx*2]`
*/
  showZeroDisplacements: boolean;
/**
* Show immediate operands as signed numbers
*
* Default | Value | Example
* --------|-------|--------
* _ | `true` | `mov eax,-1`
* 👍 | `false` | `mov eax,FFFFFFFF`
*/
  signedImmediateOperands: boolean;
/**
* Displacements are signed numbers
*
* Default | Value | Example
* --------|-------|--------
* 👍 | `true` | `mov al,[eax-2000h]`
* _ | `false` | `mov al,[eax+0FFFFE000h]`
*/
  signedMemoryDisplacements: boolean;
/**
* Small hex numbers (-9 .. 9) are shown in decimal
*
* Default | Value | Example
* --------|-------|--------
* 👍 | `true` | `9`
* _ | `false` | `0x9`
*/
  smallHexNumbersInDecimal: boolean;
/**
* Add a space between the memory expression and the brackets
*
* Default | Value | Example
* --------|-------|--------
* _ | `true` | `mov eax,[ rcx+rdx ]`
* 👍 | `false` | `mov eax,[rcx+rdx]`
*/
  spaceAfterMemoryBracket: boolean;
/**
* Add a space after the operand separator
*
* Default | Value | Example
* --------|-------|--------
* _ | `true` | `mov rax, rcx`
* 👍 | `false` | `mov rax,rcx`
*/
  spaceAfterOperandSeparator: boolean;
/**
* Add spaces between memory operand `+` and `-` operators
*
* Default | Value | Example
* --------|-------|--------
* _ | `true` | `mov eax,[rcx + rdx*8 - 80h]`
* 👍 | `false` | `mov eax,[rcx+rdx*8-80h]`
*/
  spaceBetweenMemoryAddOperators: boolean;
/**
* Add spaces between memory operand `*` operator
*
* Default | Value | Example
* --------|-------|--------
* _ | `true` | `mov eax,[rcx+rdx * 8-80h]`
* 👍 | `false` | `mov eax,[rcx+rdx*8-80h]`
*/
  spaceBetweenMemoryMulOperators: boolean;
/**
* Size of a tab character or 0 to use spaces
*
* - Default: `0`
*/
  tabSize: number;
/**
* Everything is uppercased, except numbers and their prefixes/suffixes
*
* Default | Value | Example
* --------|-------|--------
* _ | `true` | `MOV EAX,GS:[RCX*4+0ffh]`
* 👍 | `false` | `mov eax,gs:[rcx*4+0ffh]`
*/
  uppercaseAll: boolean;
/**
* Uppercase decorators, eg. `{z}`, `{sae}`, `{rd-sae}` (but not opmask registers: `{k1}`)
*
* Default | Value | Example
* --------|-------|--------
* _ | `true` | `vunpcklps xmm2{k5}{Z},xmm6,dword bcst [rax+4]`
* 👍 | `false` | `vunpcklps xmm2{k5}{z},xmm6,dword bcst [rax+4]`
*/
  uppercaseDecorators: boolean;
/**
* Use uppercase hex digits
*
* Default | Value | Example
* --------|-------|--------
* 👍 | `true` | `0xFF`
* _ | `false` | `0xff`
*/
  uppercaseHex: boolean;
/**
* Keywords are uppercased (eg. `BYTE PTR`, `SHORT`)
*
* Default | Value | Example
* --------|-------|--------
* _ | `true` | `mov BYTE PTR [rcx],12h`
* 👍 | `false` | `mov byte ptr [rcx],12h`
*/
  uppercaseKeywords: boolean;
/**
* Mnemonics are uppercased
*
* Default | Value | Example
* --------|-------|--------
* _ | `true` | `MOV rcx,rax`
* 👍 | `false` | `mov rcx,rax`
*/
  uppercaseMnemonics: boolean;
/**
* Prefixes are uppercased
*
* Default | Value | Example
* --------|-------|--------
* _ | `true` | `REP stosd`
* 👍 | `false` | `rep stosd`
*/
  uppercasePrefixes: boolean;
/**
* Registers are uppercased
*
* Default | Value | Example
* --------|-------|--------
* _ | `true` | `mov RCX,[RAX+RDX*8]`
* 👍 | `false` | `mov rcx,[rax+rdx*8]`
*/
  uppercaseRegisters: boolean;
/**
* Use pseudo instructions
*
* Default | Value | Example
* --------|-------|--------
* 👍 | `true` | `vcmpnltsd xmm2,xmm6,xmm3`
* _ | `false` | `vcmpsd xmm2,xmm6,xmm3,5`
*/
  usePseudoOps: boolean;
}
/**
* A 16/32/64-bit x86 instruction. Created by [`Decoder`] or by `Instruction.with*()` methods.
*
* [`Decoder`]: struct.Decoder.html
*/
export class Instruction {
  free(): void;
/**
* Creates an empty `Instruction` (all fields are cleared). See also the `create*()` constructor methods.
*/
  constructor();
/**
* Checks if two instructions are equal, comparing all bits, not ignoring anything. `equals()` ignores some fields.
* @param {Instruction} other
* @returns {boolean}
*/
  equalsAllBits(other: Instruction): boolean;
/**
* Gets an operand's kind (an [`OpKind`] enum value) if it exists (see [`opCount`])
*
* [`OpKind`]: enum.OpKind.html
* [`opCount`]: #method.op_count
*
* # Throws
*
* Throws if `operand` is invalid
*
* # Arguments
*
* * `operand`: Operand number, 0-4
*
* # Examples
*
* ```js
* const assert = require("assert").strict;
* const { Decoder, DecoderOptions, OpKind, Register } = require("iced-x86");
*
* // add [rax],ebx
* const bytes = new Uint8Array([0x01, 0x18]);
* const decoder = new Decoder(64, bytes, DecoderOptions.None);
* const instr = decoder.decode();
*
* assert.equal(instr.opCount, 2);
* assert.equal(instr.opKind(0), OpKind.Memory);
* assert.equal(instr.memoryBase, Register.RAX);
* assert.equal(instr.memoryIndex, Register.None);
* assert.equal(instr.opKind(1), OpKind.Register);
* assert.equal(instr.opRegister(1), Register.EBX);
*
* // Free wasm memory
* decoder.free();
* instr.free();
* ```
* @param {number} operand
* @returns {OpKind}
*/
  opKind(operand: number): OpKind;
/**
* Sets an operand's kind (an [`OpKind`] enum value)
*
* [`OpKind`]: enum.OpKind.html
*
* # Throws
*
* Throws if `operand` is invalid
*
* # Arguments
*
* * `operand`: Operand number, 0-4
* * `opKind`: Operand kind
* @param {number} operand
* @param {OpKind} opKind
*/
  setOpKind(operand: number, opKind: OpKind): void;
/**
* Gets an operand's immediate value
*
* # Throws
*
* Throws if `operand` is invalid or if it's not an immediate operand
*
* # Arguments
*
* * `operand`: Operand number, 0-4
* @param {number} operand
* @returns {bigint}
*/
  immediate(operand: number): bigint;
/**
* Sets an operand's immediate value
*
* # Throws
*
* Throws if `operand` is invalid or if it's not an immediate operand
*
* # Arguments
*
* * `operand`: Operand number, 0-4
* * `newValue`: Immediate
* @param {number} operand
* @param {number} newValue
*/
  setImmediateI32(operand: number, newValue: number): void;
/**
* Sets an operand's immediate value
*
* # Throws
*
* Throws if `operand` is invalid or if it's not an immediate operand
*
* # Arguments
*
* * `operand`: Operand number, 0-4
* * `newValue`: Immediate
* @param {number} operand
* @param {number} newValue
*/
  setImmediateU32(operand: number, newValue: number): void;
/**
* Sets an operand's immediate value
*
* # Throws
*
* Throws if `operand` is invalid or if it's not an immediate operand
*
* # Arguments
*
* * `operand`: Operand number, 0-4
* * `newValue`: Immediate
* @param {number} operand
* @param {bigint} newValue
*/
  setImmediateI64(operand: number, newValue: bigint): void;
/**
* Sets an operand's immediate value
*
* # Throws
*
* Throws if `operand` is invalid or if it's not an immediate operand
*
* # Arguments
*
* * `operand`: Operand number, 0-4
* * `newValue`: Immediate
* @param {number} operand
* @param {bigint} newValue
*/
  setImmediateU64(operand: number, newValue: bigint): void;
/**
* Gets the operand's register value (a [`Register`] enum value). Use this method if the operand has kind [`OpKind.Register`]
*
* [`Register`]: enum.Register.html
* [`OpKind.Register`]: enum.OpKind.html#variant.Register
*
* # Throws
*
* Throws if `operand` is invalid
*
* # Arguments
*
* * `operand`: Operand number, 0-4
*
* # Examples
*
* ```js
* const assert = require("assert").strict;
* const { Decoder, DecoderOptions, OpKind, Register } = require("iced-x86");
*
* // add [rax],ebx
* const bytes = new Uint8Array([0x01, 0x18]);
* const decoder = new Decoder(64, bytes, DecoderOptions.None);
* const instr = decoder.decode();
*
* assert.equal(instr.opCount, 2);
* assert.equal(instr.opKind(0), OpKind.Memory);
* assert.equal(instr.opKind(1), OpKind.Register);
* assert.equal(instr.opRegister(1), Register.EBX);
*
* // Free wasm memory
* decoder.free();
* instr.free();
* ```
* @param {number} operand
* @returns {Register}
*/
  opRegister(operand: number): Register;
/**
* Sets the operand's register value (a [`Register`] enum value). Use this method if the operand has kind [`OpKind.Register`]
*
* [`Register`]: enum.Register.html
* [`OpKind.Register`]: enum.OpKind.html#variant.Register
*
* # Throws
*
* Throws if `operand` is invalid
*
* # Arguments
*
* * `operand`: Operand number, 0-4
* * `newValue`: New value
* @param {number} operand
* @param {Register} newValue
*/
  setOpRegister(operand: number, newValue: Register): void;
/**
* Gets the CPU or CPUID feature flags (an array of [`CpuidFeature`] values)
*
* [`CpuidFeature`]: enum.CpuidFeature.html
*
* # Examples
*
* ```js
* const assert = require("assert").strict;
* const { Decoder, DecoderOptions, CpuidFeature } = require("iced-x86");
*
* // vmovaps xmm1,xmm5
* // vmovaps xmm10{k3}{z},xmm19
* const bytes = new Uint8Array([0xC5, 0xF8, 0x28, 0xCD, 0x62, 0x31, 0x7C, 0x8B, 0x28, 0xD3]);
* const decoder = new Decoder(64, bytes, DecoderOptions.None);
*
* // vmovaps xmm1,xmm5
* const instr = decoder.decode();
* let cpuid = instr.cpuidFeatures();
* assert.equal(cpuid.length, 1);
* assert.equal(cpuid[0], CpuidFeature.AVX);
*
* // vmovaps xmm10{k3}{z},xmm19
* decoder.decodeOut(instr);
* cpuid = instr.cpuidFeatures();
* assert.equal(cpuid.length, 2);
* assert.equal(cpuid[0], CpuidFeature.AVX512VL);
* assert.equal(cpuid[1], CpuidFeature.AVX512F);
*
* // Free wasm memory
* decoder.free();
* instr.free();
* ```
* @returns {Int32Array}
*/
  cpuidFeatures(): Int32Array;
/**
* Negates the condition code, eg. `JE` -> `JNE`. Can be used if it's `Jcc`, `SETcc`, `CMOVcc`, `CMPccXADD` and does
* nothing if the instruction doesn't have a condition code.
*
* # Examples
*
* ```js
* const assert = require("assert").strict;
* const { Code, ConditionCode, Decoder, DecoderOptions } = require("iced-x86");
*
* // setbe al
* const bytes = new Uint8Array([0x0F, 0x96, 0xC0]);
* const decoder = new Decoder(64, bytes, DecoderOptions.None);
*
* const instr = decoder.decode();
* assert.equal(instr.code, Code.Setbe_rm8);
* assert.equal(instr.conditionCode, ConditionCode.be);
* instr.negateConditionCode();
* assert.equal(instr.code, Code.Seta_rm8);
* assert.equal(instr.conditionCode, ConditionCode.a);
*
* // Free wasm memory
* decoder.free();
* instr.free();
* ```
*/
  negateConditionCode(): void;
/**
* Converts `Jcc/JMP NEAR` to `Jcc/JMP SHORT` and does nothing if it's not a `Jcc/JMP NEAR` instruction
*
* # Examples
*
* ```js
* const assert = require("assert").strict;
* const { Code, Decoder, DecoderOptions } = require("iced-x86");
*
* // jbe near ptr label
* const bytes = new Uint8Array([0x0F, 0x86, 0x5A, 0xA5, 0x12, 0x34]);
* const decoder = new Decoder(64, bytes, DecoderOptions.None);
*
* const instr = decoder.decode();
* assert.equal(instr.code, Code.Jbe_rel32_64);
* instr.asShortBranch();
* assert.equal(instr.code, Code.Jbe_rel8_64);
* instr.asShortBranch();
* assert.equal(instr.code, Code.Jbe_rel8_64);
*
* // Free wasm memory
* decoder.free();
* instr.free();
* ```
*/
  asShortBranch(): void;
/**
* Converts `Jcc/JMP SHORT` to `Jcc/JMP NEAR` and does nothing if it's not a `Jcc/JMP SHORT` instruction
*
* # Examples
*
* ```js
* const assert = require("assert").strict;
* const { Code, Decoder, DecoderOptions } = require("iced-x86");
*
* // jbe short label
* const bytes = new Uint8Array([0x76, 0x5A]);
* const decoder = new Decoder(64, bytes, DecoderOptions.None);
*
* const instr = decoder.decode();
* assert.equal(instr.code, Code.Jbe_rel8_64);
* instr.asNearBranch();
* assert.equal(instr.code, Code.Jbe_rel32_64);
* instr.asNearBranch();
* assert.equal(instr.code, Code.Jbe_rel32_64);
*
* // Free wasm memory
* decoder.free();
* instr.free();
* ```
*/
  asNearBranch(): void;
/**
* Checks if this instance is equal to another instance. It ignores some fields,
* such as the IP address, code size, etc.
* @param {Instruction} other
* @returns {boolean}
*/
  equals(other: Instruction): boolean;
/**
* Clones this instance
* @returns {Instruction}
*/
  clone(): Instruction;
/**
* Gets the default disassembly string
* @returns {string}
*/
  toString(): string;
/**
* Sets a new `db` value, see also [`declareDataLength`].
* Can only be called if [`code`] is [`Code.DeclareByte`]
*
* [`declareDataLength()`]: #method.declare_data_length
* [`code`]: #method.code
* [`Code.DeclareByte`]: enum.Code.html#variant.DeclareByte
*
* # Throws
*
* Throws if `index` is invalid
*
* # Arguments
*
* * `index`: Index (0-15)
* * `newValue`: New value
* @param {number} index
* @param {number} newValue
*/
  setDeclareByteValueI8(index: number, newValue: number): void;
/**
* Sets a new `db` value, see also [`declareDataLength`].
* Can only be called if [`code`] is [`Code.DeclareByte`]
*
* [`declareDataLength`]: #method.declare_data_length
* [`code`]: #method.code
* [`Code.DeclareByte`]: enum.Code.html#variant.DeclareByte
*
* # Throws
*
* Throws if `index` is invalid
*
* # Arguments
*
* * `index`: Index (0-15)
* * `newValue`: New value
* @param {number} index
* @param {number} newValue
*/
  setDeclareByteValue(index: number, newValue: number): void;
/**
* Gets a `db` value, see also [`declareDataLength`].
* Can only be called if [`code`] is [`Code.DeclareByte`]
*
* [`declareDataLength`]: #method.declare_data_length
* [`code`]: #method.code
* [`Code.DeclareByte`]: enum.Code.html#variant.DeclareByte
*
* # Throws
*
* Throws if `index` is invalid
*
* # Arguments
*
* * `index`: Index (0-15)
* @param {number} index
* @returns {number}
*/
  getDeclareByteValue(index: number): number;
/**
* Gets a `db` value, see also [`declareDataLength`].
* Can only be called if [`code`] is [`Code.DeclareByte`]
*
* [`declareDataLength`]: #method.declare_data_length
* [`code`]: #method.code
* [`Code.DeclareByte`]: enum.Code.html#variant.DeclareByte
*
* # Throws
*
* Throws if `index` is invalid
*
* # Arguments
*
* * `index`: Index (0-15)
* @param {number} index
* @returns {number}
*/
  getDeclareByteValueI8(index: number): number;
/**
* Sets a new `dw` value, see also [`declareDataLength`].
* Can only be called if [`code`] is [`Code.DeclareWord`]
*
* [`declareDataLength`]: #method.declare_data_length
* [`code`]: #method.code
* [`Code.DeclareWord`]: enum.Code.html#variant.DeclareWord
*
* # Throws
*
* Throws if `index` is invalid
*
* # Arguments
*
* * `index`: Index (0-7)
* * `newValue`: New value
* @param {number} index
* @param {number} newValue
*/
  setDeclareWordValueI16(index: number, newValue: number): void;
/**
* Sets a new `dw` value, see also [`declareDataLength`].
* Can only be called if [`code`] is [`Code.DeclareWord`]
*
* [`declareDataLength`]: #method.declare_data_length
* [`code`]: #method.code
* [`Code.DeclareWord`]: enum.Code.html#variant.DeclareWord
*
* # Throws
*
* Throws if `index` is invalid
*
* # Arguments
*
* * `index`: Index (0-7)
* * `newValue`: New value
* @param {number} index
* @param {number} newValue
*/
  setDeclareWordValue(index: number, newValue: number): void;
/**
* Gets a `dw` value, see also [`declareDataLength`].
* Can only be called if [`code`] is [`Code.DeclareWord`]
*
* [`declareDataLength`]: #method.declare_data_length
* [`code`]: #method.code
* [`Code.DeclareWord`]: enum.Code.html#variant.DeclareWord
*
* # Throws
*
* Throws if `index` is invalid
*
* # Arguments
*
* * `index`: Index (0-7)
* @param {number} index
* @returns {number}
*/
  getDeclareWordValue(index: number): number;
/**
* Gets a `dw` value, see also [`declareDataLength`].
* Can only be called if [`code`] is [`Code.DeclareWord`]
*
* [`declareDataLength`]: #method.declare_data_length
* [`code`]: #method.code
* [`Code.DeclareWord`]: enum.Code.html#variant.DeclareWord
*
* # Throws
*
* Throws if `index` is invalid
*
* # Arguments
*
* * `index`: Index (0-7)
* @param {number} index
* @returns {number}
*/
  getDeclareWordValueI16(index: number): number;
/**
* Sets a new `dd` value, see also [`declareDataLength`].
* Can only be called if [`code`] is [`Code.DeclareDword`]
*
* [`declareDataLength`]: #method.declare_data_length
* [`code`]: #method.code
* [`Code.DeclareDword`]: enum.Code.html#variant.DeclareDword
*
* # Throws
*
* Throws if `index` is invalid
*
* # Arguments
*
* * `index`: Index (0-3)
* * `newValue`: New value
* @param {number} index
* @param {number} newValue
*/
  setDeclareDwordValueI32(index: number, newValue: number): void;
/**
* Sets a new `dd` value, see also [`declareDataLength`].
* Can only be called if [`code`] is [`Code.DeclareDword`]
*
* [`declareDataLength`]: #method.declare_data_length
* [`code`]: #method.code
* [`Code.DeclareDword`]: enum.Code.html#variant.DeclareDword
*
* # Throws
*
* Throws if `index` is invalid
*
* # Arguments
*
* * `index`: Index (0-3)
* * `newValue`: New value
* @param {number} index
* @param {number} newValue
*/
  setDeclareDwordValue(index: number, newValue: number): void;
/**
* Gets a `dd` value, see also [`declareDataLength`].
* Can only be called if [`code`] is [`Code.DeclareDword`]
*
* [`declareDataLength`]: #method.declare_data_length
* [`code`]: #method.code
* [`Code.DeclareDword`]: enum.Code.html#variant.DeclareDword
*
* # Throws
*
* Throws if `index` is invalid
*
* # Arguments
*
* * `index`: Index (0-3)
* @param {number} index
* @returns {number}
*/
  getDeclareDwordValue(index: number): number;
/**
* Gets a `dd` value, see also [`declareDataLength`].
* Can only be called if [`code`] is [`Code.DeclareDword`]
*
* [`declareDataLength`]: #method.declare_data_length
* [`code`]: #method.code
* [`Code.DeclareDword`]: enum.Code.html#variant.DeclareDword
*
* # Throws
*
* Throws if `index` is invalid
*
* # Arguments
*
* * `index`: Index (0-3)
* @param {number} index
* @returns {number}
*/
  getDeclareDwordValueI32(index: number): number;
/**
* Sets a new `dq` value, see also [`declareDataLength`].
* Can only be called if [`code`] is [`Code.DeclareQword`]
*
* [`declareDataLength`]: #method.declare_data_length
* [`code`]: #method.code
* [`Code.DeclareQword`]: enum.Code.html#variant.DeclareQword
*
* # Throws
*
* Throws if `index` is invalid
*
* # Arguments
*
* * `index`: Index (0-1)
* * `newValue`: New value
* @param {number} index
* @param {bigint} newValue
*/
  setDeclareQwordValueI64(index: number, newValue: bigint): void;
/**
* Sets a new `dq` value, see also [`declareDataLength`].
* Can only be called if [`code`] is [`Code.DeclareQword`]
*
* [`declareDataLength`]: #method.declare_data_length
* [`code`]: #method.code
* [`Code.DeclareQword`]: enum.Code.html#variant.DeclareQword
*
* # Throws
*
* Throws if `index` is invalid
*
* # Arguments
*
* * `index`: Index (0-1)
* * `newValue`: New value
* @param {number} index
* @param {bigint} newValue
*/
  setDeclareQwordValue(index: number, newValue: bigint): void;
/**
* Gets a `dq` value, see also [`declareDataLength`].
* Can only be called if [`code`] is [`Code.DeclareQword`]
*
* [`declareDataLength`]: #method.declare_data_length
* [`code`]: #method.code
* [`Code.DeclareQword`]: enum.Code.html#variant.DeclareQword
*
* # Throws
*
* Throws if `index` is invalid
*
* # Arguments
*
* * `index`: Index (0-1)
* @param {number} index
* @returns {bigint}
*/
  getDeclareQwordValue(index: number): bigint;
/**
* Gets a `dq` value, see also [`declareDataLength`].
* Can only be called if [`code`] is [`Code.DeclareQword`]
*
* [`declareDataLength`]: #method.declare_data_length
* [`code`]: #method.code
* [`Code.DeclareQword`]: enum.Code.html#variant.DeclareQword
*
* # Throws
*
* Throws if `index` is invalid
*
* # Arguments
*
* * `index`: Index (0-1)
* @param {number} index
* @returns {bigint}
*/
  getDeclareQwordValueI64(index: number): bigint;
/**
* Creates an instruction with no operands
*
* # Arguments
*
* * `code`: Code value (a [`Code`] enum value)
*
* [`Code`]: enum.Code.html
* @param {Code} code
* @returns {Instruction}
*/
  static create(code: Code): Instruction;
/**
* Creates an instruction with 1 operand
*
* # Throws
*
* Throws if one of the operands is invalid (basic checks)
*
* # Arguments
*
* * `code`: Code value (a [`Code`] enum value)
* * `register`: op0: Register (a [`Register`] enum value)
*
* [`Code`]: enum.Code.html
* [`Register`]: enum.Register.html
* @param {Code} code
* @param {Register} register
* @returns {Instruction}
*/
  static createReg(code: Code, register: Register): Instruction;
/**
* Creates an instruction with 1 operand
*
* # Throws
*
* Throws if one of the operands is invalid (basic checks)
*
* # Arguments
*
* * `code`: Code value (a [`Code`] enum value)
* * `immediate`: op0: Immediate value
*
* [`Code`]: enum.Code.html
* @param {Code} code
* @param {number} immediate
* @returns {Instruction}
*/
  static createI32(code: Code, immediate: number): Instruction;
/**
* Creates an instruction with 1 operand
*
* # Throws
*
* Throws if one of the operands is invalid (basic checks)
*
* # Arguments
*
* * `code`: Code value (a [`Code`] enum value)
* * `immediate`: op0: Immediate value
*
* [`Code`]: enum.Code.html
* @param {Code} code
* @param {number} immediate
* @returns {Instruction}
*/
  static createU32(code: Code, immediate: number): Instruction;
/**
* Creates an instruction with 1 operand
*
* # Throws
*
* Throws if one of the operands is invalid (basic checks)
*
* # Arguments
*
* * `code`: Code value (a [`Code`] enum value)
* * `memory`: op0: Memory operand
*
* [`Code`]: enum.Code.html
* @param {Code} code
* @param {MemoryOperand} memory
* @returns {Instruction}
*/
  static createMem(code: Code, memory: MemoryOperand): Instruction;
/**
* Creates an instruction with 2 operands
*
* # Throws
*
* Throws if one of the operands is invalid (basic checks)
*
* # Arguments
*
* * `code`: Code value (a [`Code`] enum value)
* * `register1`: op0: Register (a [`Register`] enum value)
* * `register2`: op1: Register (a [`Register`] enum value)
*
* [`Code`]: enum.Code.html
* [`Register`]: enum.Register.html
* @param {Code} code
* @param {Register} register1
* @param {Register} register2
* @returns {Instruction}
*/
  static createRegReg(code: Code, register1: Register, register2: Register): Instruction;
/**
* Creates an instruction with 2 operands
*
* # Throws
*
* Throws if one of the operands is invalid (basic checks)
*
* # Arguments
*
* * `code`: Code value (a [`Code`] enum value)
* * `register`: op0: Register (a [`Register`] enum value)
* * `immediate`: op1: Immediate value
*
* [`Code`]: enum.Code.html
* [`Register`]: enum.Register.html
* @param {Code} code
* @param {Register} register
* @param {number} immediate
* @returns {Instruction}
*/
  static createRegI32(code: Code, register: Register, immediate: number): Instruction;
/**
* Creates an instruction with 2 operands
*
* # Throws
*
* Throws if one of the operands is invalid (basic checks)
*
* # Arguments
*
* * `code`: Code value (a [`Code`] enum value)
* * `register`: op0: Register (a [`Register`] enum value)
* * `immediate`: op1: Immediate value
*
* [`Code`]: enum.Code.html
* [`Register`]: enum.Register.html
* @param {Code} code
* @param {Register} register
* @param {number} immediate
* @returns {Instruction}
*/
  static createRegU32(code: Code, register: Register, immediate: number): Instruction;
/**
* Creates an instruction with 2 operands
*
* # Throws
*
* Throws if one of the operands is invalid (basic checks)
*
* # Arguments
*
* * `code`: Code value (a [`Code`] enum value)
* * `register`: op0: Register (a [`Register`] enum value)
* * `immediate`: op1: Immediate value
*
* [`Code`]: enum.Code.html
* [`Register`]: enum.Register.html
* @param {Code} code
* @param {Register} register
* @param {bigint} immediate
* @returns {Instruction}
*/
  static createRegI64(code: Code, register: Register, immediate: bigint): Instruction;
/**
* Creates an instruction with 2 operands
*
* # Throws
*
* Throws if one of the operands is invalid (basic checks)
*
* # Arguments
*
* * `code`: Code value (a [`Code`] enum value)
* * `register`: op0: Register (a [`Register`] enum value)
* * `immediate`: op1: Immediate value
*
* [`Code`]: enum.Code.html
* [`Register`]: enum.Register.html
* @param {Code} code
* @param {Register} register
* @param {bigint} immediate
* @returns {Instruction}
*/
  static createRegU64(code: Code, register: Register, immediate: bigint): Instruction;
/**
* Creates an instruction with 2 operands
*
* # Throws
*
* Throws if one of the operands is invalid (basic checks)
*
* # Arguments
*
* * `code`: Code value (a [`Code`] enum value)
* * `register`: op0: Register (a [`Register`] enum value)
* * `memory`: op1: Memory operand
*
* [`Code`]: enum.Code.html
* [`Register`]: enum.Register.html
* @param {Code} code
* @param {Register} register
* @param {MemoryOperand} memory
* @returns {Instruction}
*/
  static createRegMem(code: Code, register: Register, memory: MemoryOperand): Instruction;
/**
* Creates an instruction with 2 operands
*
* # Throws
*
* Throws if one of the operands is invalid (basic checks)
*
* # Arguments
*
* * `code`: Code value (a [`Code`] enum value)
* * `immediate`: op0: Immediate value
* * `register`: op1: Register (a [`Register`] enum value)
*
* [`Code`]: enum.Code.html
* [`Register`]: enum.Register.html
* @param {Code} code
* @param {number} immediate
* @param {Register} register
* @returns {Instruction}
*/
  static createI32Reg(code: Code, immediate: number, register: Register): Instruction;
/**
* Creates an instruction with 2 operands
*
* # Throws
*
* Throws if one of the operands is invalid (basic checks)
*
* # Arguments
*
* * `code`: Code value (a [`Code`] enum value)
* * `immediate`: op0: Immediate value
* * `register`: op1: Register (a [`Register`] enum value)
*
* [`Code`]: enum.Code.html
* [`Register`]: enum.Register.html
* @param {Code} code
* @param {number} immediate
* @param {Register} register
* @returns {Instruction}
*/
  static createU32Reg(code: Code, immediate: number, register: Register): Instruction;
/**
* Creates an instruction with 2 operands
*
* # Throws
*
* Throws if one of the operands is invalid (basic checks)
*
* # Arguments
*
* * `code`: Code value (a [`Code`] enum value)
* * `immediate1`: op0: Immediate value
* * `immediate2`: op1: Immediate value
*
* [`Code`]: enum.Code.html
* @param {Code} code
* @param {number} immediate1
* @param {number} immediate2
* @returns {Instruction}
*/
  static createI32I32(code: Code, immediate1: number, immediate2: number): Instruction;
/**
* Creates an instruction with 2 operands
*
* # Throws
*
* Throws if one of the operands is invalid (basic checks)
*
* # Arguments
*
* * `code`: Code value (a [`Code`] enum value)
* * `immediate1`: op0: Immediate value
* * `immediate2`: op1: Immediate value
*
* [`Code`]: enum.Code.html
* @param {Code} code
* @param {number} immediate1
* @param {number} immediate2
* @returns {Instruction}
*/
  static createU32U32(code: Code, immediate1: number, immediate2: number): Instruction;
/**
* Creates an instruction with 2 operands
*
* # Throws
*
* Throws if one of the operands is invalid (basic checks)
*
* # Arguments
*
* * `code`: Code value (a [`Code`] enum value)
* * `memory`: op0: Memory operand
* * `register`: op1: Register (a [`Register`] enum value)
*
* [`Code`]: enum.Code.html
* [`Register`]: enum.Register.html
* @param {Code} code
* @param {MemoryOperand} memory
* @param {Register} register
* @returns {Instruction}
*/
  static createMemReg(code: Code, memory: MemoryOperand, register: Register): Instruction;
/**
* Creates an instruction with 2 operands
*
* # Throws
*
* Throws if one of the operands is invalid (basic checks)
*
* # Arguments
*
* * `code`: Code value (a [`Code`] enum value)
* * `memory`: op0: Memory operand
* * `immediate`: op1: Immediate value
*
* [`Code`]: enum.Code.html
* @param {Code} code
* @param {MemoryOperand} memory
* @param {number} immediate
* @returns {Instruction}
*/
  static createMemI32(code: Code, memory: MemoryOperand, immediate: number): Instruction;
/**
* Creates an instruction with 2 operands
*
* # Throws
*
* Throws if one of the operands is invalid (basic checks)
*
* # Arguments
*
* * `code`: Code value (a [`Code`] enum value)
* * `memory`: op0: Memory operand
* * `immediate`: op1: Immediate value
*
* [`Code`]: enum.Code.html
* @param {Code} code
* @param {MemoryOperand} memory
* @param {number} immediate
* @returns {Instruction}
*/
  static createMemU32(code: Code, memory: MemoryOperand, immediate: number): Instruction;
/**
* Creates an instruction with 3 operands
*
* # Throws
*
* Throws if one of the operands is invalid (basic checks)
*
* # Arguments
*
* * `code`: Code value (a [`Code`] enum value)
* * `register1`: op0: Register (a [`Register`] enum value)
* * `register2`: op1: Register (a [`Register`] enum value)
* * `register3`: op2: Register (a [`Register`] enum value)
*
* [`Code`]: enum.Code.html
* [`Register`]: enum.Register.html
* @param {Code} code
* @param {Register} register1
* @param {Register} register2
* @param {Register} register3
* @returns {Instruction}
*/
  static createRegRegReg(code: Code, register1: Register, register2: Register, register3: Register): Instruction;
/**
* Creates an instruction with 3 operands
*
* # Throws
*
* Throws if one of the operands is invalid (basic checks)
*
* # Arguments
*
* * `code`: Code value (a [`Code`] enum value)
* * `register1`: op0: Register (a [`Register`] enum value)
* * `register2`: op1: Register (a [`Register`] enum value)
* * `immediate`: op2: Immediate value
*
* [`Code`]: enum.Code.html
* [`Register`]: enum.Register.html
* @param {Code} code
* @param {Register} register1
* @param {Register} register2
* @param {number} immediate
* @returns {Instruction}
*/
  static createRegRegI32(code: Code, register1: Register, register2: Register, immediate: number): Instruction;
/**
* Creates an instruction with 3 operands
*
* # Throws
*
* Throws if one of the operands is invalid (basic checks)
*
* # Arguments
*
* * `code`: Code value (a [`Code`] enum value)
* * `register1`: op0: Register (a [`Register`] enum value)
* * `register2`: op1: Register (a [`Register`] enum value)
* * `immediate`: op2: Immediate value
*
* [`Code`]: enum.Code.html
* [`Register`]: enum.Register.html
* @param {Code} code
* @param {Register} register1
* @param {Register} register2
* @param {number} immediate
* @returns {Instruction}
*/
  static createRegRegU32(code: Code, register1: Register, register2: Register, immediate: number): Instruction;
/**
* Creates an instruction with 3 operands
*
* # Throws
*
* Throws if one of the operands is invalid (basic checks)
*
* # Arguments
*
* * `code`: Code value (a [`Code`] enum value)
* * `register1`: op0: Register (a [`Register`] enum value)
* * `register2`: op1: Register (a [`Register`] enum value)
* * `memory`: op2: Memory operand
*
* [`Code`]: enum.Code.html
* [`Register`]: enum.Register.html
* @param {Code} code
* @param {Register} register1
* @param {Register} register2
* @param {MemoryOperand} memory
* @returns {Instruction}
*/
  static createRegRegMem(code: Code, register1: Register, register2: Register, memory: MemoryOperand): Instruction;
/**
* Creates an instruction with 3 operands
*
* # Throws
*
* Throws if one of the operands is invalid (basic checks)
*
* # Arguments
*
* * `code`: Code value (a [`Code`] enum value)
* * `register`: op0: Register (a [`Register`] enum value)
* * `immediate1`: op1: Immediate value
* * `immediate2`: op2: Immediate value
*
* [`Code`]: enum.Code.html
* [`Register`]: enum.Register.html
* @param {Code} code
* @param {Register} register
* @param {number} immediate1
* @param {number} immediate2
* @returns {Instruction}
*/
  static createRegI32I32(code: Code, register: Register, immediate1: number, immediate2: number): Instruction;
/**
* Creates an instruction with 3 operands
*
* # Throws
*
* Throws if one of the operands is invalid (basic checks)
*
* # Arguments
*
* * `code`: Code value (a [`Code`] enum value)
* * `register`: op0: Register (a [`Register`] enum value)
* * `immediate1`: op1: Immediate value
* * `immediate2`: op2: Immediate value
*
* [`Code`]: enum.Code.html
* [`Register`]: enum.Register.html
* @param {Code} code
* @param {Register} register
* @param {number} immediate1
* @param {number} immediate2
* @returns {Instruction}
*/
  static createRegU32U32(code: Code, register: Register, immediate1: number, immediate2: number): Instruction;
/**
* Creates an instruction with 3 operands
*
* # Throws
*
* Throws if one of the operands is invalid (basic checks)
*
* # Arguments
*
* * `code`: Code value (a [`Code`] enum value)
* * `register1`: op0: Register (a [`Register`] enum value)
* * `memory`: op1: Memory operand
* * `register2`: op2: Register (a [`Register`] enum value)
*
* [`Code`]: enum.Code.html
* [`Register`]: enum.Register.html
* @param {Code} code
* @param {Register} register1
* @param {MemoryOperand} memory
* @param {Register} register2
* @returns {Instruction}
*/
  static createRegMemReg(code: Code, register1: Register, memory: MemoryOperand, register2: Register): Instruction;
/**
* Creates an instruction with 3 operands
*
* # Throws
*
* Throws if one of the operands is invalid (basic checks)
*
* # Arguments
*
* * `code`: Code value (a [`Code`] enum value)
* * `register`: op0: Register (a [`Register`] enum value)
* * `memory`: op1: Memory operand
* * `immediate`: op2: Immediate value
*
* [`Code`]: enum.Code.html
* [`Register`]: enum.Register.html
* @param {Code} code
* @param {Register} register
* @param {MemoryOperand} memory
* @param {number} immediate
* @returns {Instruction}
*/
  static createRegMemI32(code: Code, register: Register, memory: MemoryOperand, immediate: number): Instruction;
/**
* Creates an instruction with 3 operands
*
* # Throws
*
* Throws if one of the operands is invalid (basic checks)
*
* # Arguments
*
* * `code`: Code value (a [`Code`] enum value)
* * `register`: op0: Register (a [`Register`] enum value)
* * `memory`: op1: Memory operand
* * `immediate`: op2: Immediate value
*
* [`Code`]: enum.Code.html
* [`Register`]: enum.Register.html
* @param {Code} code
* @param {Register} register
* @param {MemoryOperand} memory
* @param {number} immediate
* @returns {Instruction}
*/
  static createRegMemU32(code: Code, register: Register, memory: MemoryOperand, immediate: number): Instruction;
/**
* Creates an instruction with 3 operands
*
* # Throws
*
* Throws if one of the operands is invalid (basic checks)
*
* # Arguments
*
* * `code`: Code value (a [`Code`] enum value)
* * `memory`: op0: Memory operand
* * `register1`: op1: Register (a [`Register`] enum value)
* * `register2`: op2: Register (a [`Register`] enum value)
*
* [`Code`]: enum.Code.html
* [`Register`]: enum.Register.html
* @param {Code} code
* @param {MemoryOperand} memory
* @param {Register} register1
* @param {Register} register2
* @returns {Instruction}
*/
  static createMemRegReg(code: Code, memory: MemoryOperand, register1: Register, register2: Register): Instruction;
/**
* Creates an instruction with 3 operands
*
* # Throws
*
* Throws if one of the operands is invalid (basic checks)
*
* # Arguments
*
* * `code`: Code value (a [`Code`] enum value)
* * `memory`: op0: Memory operand
* * `register`: op1: Register (a [`Register`] enum value)
* * `immediate`: op2: Immediate value
*
* [`Code`]: enum.Code.html
* [`Register`]: enum.Register.html
* @param {Code} code
* @param {MemoryOperand} memory
* @param {Register} register
* @param {number} immediate
* @returns {Instruction}
*/
  static createMemRegI32(code: Code, memory: MemoryOperand, register: Register, immediate: number): Instruction;
/**
* Creates an instruction with 3 operands
*
* # Throws
*
* Throws if one of the operands is invalid (basic checks)
*
* # Arguments
*
* * `code`: Code value (a [`Code`] enum value)
* * `memory`: op0: Memory operand
* * `register`: op1: Register (a [`Register`] enum value)
* * `immediate`: op2: Immediate value
*
* [`Code`]: enum.Code.html
* [`Register`]: enum.Register.html
* @param {Code} code
* @param {MemoryOperand} memory
* @param {Register} register
* @param {number} immediate
* @returns {Instruction}
*/
  static createMemRegU32(code: Code, memory: MemoryOperand, register: Register, immediate: number): Instruction;
/**
* Creates an instruction with 4 operands
*
* # Throws
*
* Throws if one of the operands is invalid (basic checks)
*
* # Arguments
*
* * `code`: Code value (a [`Code`] enum value)
* * `register1`: op0: Register (a [`Register`] enum value)
* * `register2`: op1: Register (a [`Register`] enum value)
* * `register3`: op2: Register (a [`Register`] enum value)
* * `register4`: op3: Register (a [`Register`] enum value)
*
* [`Code`]: enum.Code.html
* [`Register`]: enum.Register.html
* @param {Code} code
* @param {Register} register1
* @param {Register} register2
* @param {Register} register3
* @param {Register} register4
* @returns {Instruction}
*/
  static createRegRegRegReg(code: Code, register1: Register, register2: Register, register3: Register, register4: Register): Instruction;
/**
* Creates an instruction with 4 operands
*
* # Throws
*
* Throws if one of the operands is invalid (basic checks)
*
* # Arguments
*
* * `code`: Code value (a [`Code`] enum value)
* * `register1`: op0: Register (a [`Register`] enum value)
* * `register2`: op1: Register (a [`Register`] enum value)
* * `register3`: op2: Register (a [`Register`] enum value)
* * `immediate`: op3: Immediate value
*
* [`Code`]: enum.Code.html
* [`Register`]: enum.Register.html
* @param {Code} code
* @param {Register} register1
* @param {Register} register2
* @param {Register} register3
* @param {number} immediate
* @returns {Instruction}
*/
  static createRegRegRegI32(code: Code, register1: Register, register2: Register, register3: Register, immediate: number): Instruction;
/**
* Creates an instruction with 4 operands
*
* # Throws
*
* Throws if one of the operands is invalid (basic checks)
*
* # Arguments
*
* * `code`: Code value (a [`Code`] enum value)
* * `register1`: op0: Register (a [`Register`] enum value)
* * `register2`: op1: Register (a [`Register`] enum value)
* * `register3`: op2: Register (a [`Register`] enum value)
* * `immediate`: op3: Immediate value
*
* [`Code`]: enum.Code.html
* [`Register`]: enum.Register.html
* @param {Code} code
* @param {Register} register1
* @param {Register} register2
* @param {Register} register3
* @param {number} immediate
* @returns {Instruction}
*/
  static createRegRegRegU32(code: Code, register1: Register, register2: Register, register3: Register, immediate: number): Instruction;
/**
* Creates an instruction with 4 operands
*
* # Throws
*
* Throws if one of the operands is invalid (basic checks)
*
* # Arguments
*
* * `code`: Code value (a [`Code`] enum value)
* * `register1`: op0: Register (a [`Register`] enum value)
* * `register2`: op1: Register (a [`Register`] enum value)
* * `register3`: op2: Register (a [`Register`] enum value)
* * `memory`: op3: Memory operand
*
* [`Code`]: enum.Code.html
* [`Register`]: enum.Register.html
* @param {Code} code
* @param {Register} register1
* @param {Register} register2
* @param {Register} register3
* @param {MemoryOperand} memory
* @returns {Instruction}
*/
  static createRegRegRegMem(code: Code, register1: Register, register2: Register, register3: Register, memory: MemoryOperand): Instruction;
/**
* Creates an instruction with 4 operands
*
* # Throws
*
* Throws if one of the operands is invalid (basic checks)
*
* # Arguments
*
* * `code`: Code value (a [`Code`] enum value)
* * `register1`: op0: Register (a [`Register`] enum value)
* * `register2`: op1: Register (a [`Register`] enum value)
* * `immediate1`: op2: Immediate value
* * `immediate2`: op3: Immediate value
*
* [`Code`]: enum.Code.html
* [`Register`]: enum.Register.html
* @param {Code} code
* @param {Register} register1
* @param {Register} register2
* @param {number} immediate1
* @param {number} immediate2
* @returns {Instruction}
*/
  static createRegRegI32I32(code: Code, register1: Register, register2: Register, immediate1: number, immediate2: number): Instruction;
/**
* Creates an instruction with 4 operands
*
* # Throws
*
* Throws if one of the operands is invalid (basic checks)
*
* # Arguments
*
* * `code`: Code value (a [`Code`] enum value)
* * `register1`: op0: Register (a [`Register`] enum value)
* * `register2`: op1: Register (a [`Register`] enum value)
* * `immediate1`: op2: Immediate value
* * `immediate2`: op3: Immediate value
*
* [`Code`]: enum.Code.html
* [`Register`]: enum.Register.html
* @param {Code} code
* @param {Register} register1
* @param {Register} register2
* @param {number} immediate1
* @param {number} immediate2
* @returns {Instruction}
*/
  static createRegRegU32U32(code: Code, register1: Register, register2: Register, immediate1: number, immediate2: number): Instruction;
/**
* Creates an instruction with 4 operands
*
* # Throws
*
* Throws if one of the operands is invalid (basic checks)
*
* # Arguments
*
* * `code`: Code value (a [`Code`] enum value)
* * `register1`: op0: Register (a [`Register`] enum value)
* * `register2`: op1: Register (a [`Register`] enum value)
* * `memory`: op2: Memory operand
* * `register3`: op3: Register (a [`Register`] enum value)
*
* [`Code`]: enum.Code.html
* [`Register`]: enum.Register.html
* @param {Code} code
* @param {Register} register1
* @param {Register} register2
* @param {MemoryOperand} memory
* @param {Register} register3
* @returns {Instruction}
*/
  static createRegRegMemReg(code: Code, register1: Register, register2: Register, memory: MemoryOperand, register3: Register): Instruction;
/**
* Creates an instruction with 4 operands
*
* # Throws
*
* Throws if one of the operands is invalid (basic checks)
*
* # Arguments
*
* * `code`: Code value (a [`Code`] enum value)
* * `register1`: op0: Register (a [`Register`] enum value)
* * `register2`: op1: Register (a [`Register`] enum value)
* * `memory`: op2: Memory operand
* * `immediate`: op3: Immediate value
*
* [`Code`]: enum.Code.html
* [`Register`]: enum.Register.html
* @param {Code} code
* @param {Register} register1
* @param {Register} register2
* @param {MemoryOperand} memory
* @param {number} immediate
* @returns {Instruction}
*/
  static createRegRegMemI32(code: Code, register1: Register, register2: Register, memory: MemoryOperand, immediate: number): Instruction;
/**
* Creates an instruction with 4 operands
*
* # Throws
*
* Throws if one of the operands is invalid (basic checks)
*
* # Arguments
*
* * `code`: Code value (a [`Code`] enum value)
* * `register1`: op0: Register (a [`Register`] enum value)
* * `register2`: op1: Register (a [`Register`] enum value)
* * `memory`: op2: Memory operand
* * `immediate`: op3: Immediate value
*
* [`Code`]: enum.Code.html
* [`Register`]: enum.Register.html
* @param {Code} code
* @param {Register} register1
* @param {Register} register2
* @param {MemoryOperand} memory
* @param {number} immediate
* @returns {Instruction}
*/
  static createRegRegMemU32(code: Code, register1: Register, register2: Register, memory: MemoryOperand, immediate: number): Instruction;
/**
* Creates an instruction with 5 operands
*
* # Throws
*
* Throws if one of the operands is invalid (basic checks)
*
* # Arguments
*
* * `code`: Code value (a [`Code`] enum value)
* * `register1`: op0: Register (a [`Register`] enum value)
* * `register2`: op1: Register (a [`Register`] enum value)
* * `register3`: op2: Register (a [`Register`] enum value)
* * `register4`: op3: Register (a [`Register`] enum value)
* * `immediate`: op4: Immediate value
*
* [`Code`]: enum.Code.html
* [`Register`]: enum.Register.html
* @param {Code} code
* @param {Register} register1
* @param {Register} register2
* @param {Register} register3
* @param {Register} register4
* @param {number} immediate
* @returns {Instruction}
*/
  static createRegRegRegRegI32(code: Code, register1: Register, register2: Register, register3: Register, register4: Register, immediate: number): Instruction;
/**
* Creates an instruction with 5 operands
*
* # Throws
*
* Throws if one of the operands is invalid (basic checks)
*
* # Arguments
*
* * `code`: Code value (a [`Code`] enum value)
* * `register1`: op0: Register (a [`Register`] enum value)
* * `register2`: op1: Register (a [`Register`] enum value)
* * `register3`: op2: Register (a [`Register`] enum value)
* * `register4`: op3: Register (a [`Register`] enum value)
* * `immediate`: op4: Immediate value
*
* [`Code`]: enum.Code.html
* [`Register`]: enum.Register.html
* @param {Code} code
* @param {Register} register1
* @param {Register} register2
* @param {Register} register3
* @param {Register} register4
* @param {number} immediate
* @returns {Instruction}
*/
  static createRegRegRegRegU32(code: Code, register1: Register, register2: Register, register3: Register, register4: Register, immediate: number): Instruction;
/**
* Creates an instruction with 5 operands
*
* # Throws
*
* Throws if one of the operands is invalid (basic checks)
*
* # Arguments
*
* * `code`: Code value (a [`Code`] enum value)
* * `register1`: op0: Register (a [`Register`] enum value)
* * `register2`: op1: Register (a [`Register`] enum value)
* * `register3`: op2: Register (a [`Register`] enum value)
* * `memory`: op3: Memory operand
* * `immediate`: op4: Immediate value
*
* [`Code`]: enum.Code.html
* [`Register`]: enum.Register.html
* @param {Code} code
* @param {Register} register1
* @param {Register} register2
* @param {Register} register3
* @param {MemoryOperand} memory
* @param {number} immediate
* @returns {Instruction}
*/
  static createRegRegRegMemI32(code: Code, register1: Register, register2: Register, register3: Register, memory: MemoryOperand, immediate: number): Instruction;
/**
* Creates an instruction with 5 operands
*
* # Throws
*
* Throws if one of the operands is invalid (basic checks)
*
* # Arguments
*
* * `code`: Code value (a [`Code`] enum value)
* * `register1`: op0: Register (a [`Register`] enum value)
* * `register2`: op1: Register (a [`Register`] enum value)
* * `register3`: op2: Register (a [`Register`] enum value)
* * `memory`: op3: Memory operand
* * `immediate`: op4: Immediate value
*
* [`Code`]: enum.Code.html
* [`Register`]: enum.Register.html
* @param {Code} code
* @param {Register} register1
* @param {Register} register2
* @param {Register} register3
* @param {MemoryOperand} memory
* @param {number} immediate
* @returns {Instruction}
*/
  static createRegRegRegMemU32(code: Code, register1: Register, register2: Register, register3: Register, memory: MemoryOperand, immediate: number): Instruction;
/**
* Creates an instruction with 5 operands
*
* # Throws
*
* Throws if one of the operands is invalid (basic checks)
*
* # Arguments
*
* * `code`: Code value (a [`Code`] enum value)
* * `register1`: op0: Register (a [`Register`] enum value)
* * `register2`: op1: Register (a [`Register`] enum value)
* * `memory`: op2: Memory operand
* * `register3`: op3: Register (a [`Register`] enum value)
* * `immediate`: op4: Immediate value
*
* [`Code`]: enum.Code.html
* [`Register`]: enum.Register.html
* @param {Code} code
* @param {Register} register1
* @param {Register} register2
* @param {MemoryOperand} memory
* @param {Register} register3
* @param {number} immediate
* @returns {Instruction}
*/
  static createRegRegMemRegI32(code: Code, register1: Register, register2: Register, memory: MemoryOperand, register3: Register, immediate: number): Instruction;
/**
* Creates an instruction with 5 operands
*
* # Throws
*
* Throws if one of the operands is invalid (basic checks)
*
* # Arguments
*
* * `code`: Code value (a [`Code`] enum value)
* * `register1`: op0: Register (a [`Register`] enum value)
* * `register2`: op1: Register (a [`Register`] enum value)
* * `memory`: op2: Memory operand
* * `register3`: op3: Register (a [`Register`] enum value)
* * `immediate`: op4: Immediate value
*
* [`Code`]: enum.Code.html
* [`Register`]: enum.Register.html
* @param {Code} code
* @param {Register} register1
* @param {Register} register2
* @param {MemoryOperand} memory
* @param {Register} register3
* @param {number} immediate
* @returns {Instruction}
*/
  static createRegRegMemRegU32(code: Code, register1: Register, register2: Register, memory: MemoryOperand, register3: Register, immediate: number): Instruction;
/**
* Creates a new near/short branch instruction
*
* # Throws
*
* Throws if the created instruction doesn't have a near branch operand
*
* # Arguments
*
* * `code`: Code value (a [`Code`] enum value)
* * `target`: Target address
*
* [`Code`]: enum.Code.html
* @param {Code} code
* @param {bigint} target
* @returns {Instruction}
*/
  static createBranch(code: Code, target: bigint): Instruction;
/**
* Creates a new far branch instruction
*
* # Throws
*
* Throws if the created instruction doesn't have a far branch operand
*
* # Arguments
*
* * `code`: Code value (a [`Code`] enum value)
* * `selector`: Selector/segment value
* * `offset`: Offset
*
* [`Code`]: enum.Code.html
* @param {Code} code
* @param {number} selector
* @param {number} offset
* @returns {Instruction}
*/
  static createFarBranch(code: Code, selector: number, offset: number): Instruction;
/**
* Creates a new `XBEGIN` instruction
*
* # Throws
*
* Throws if `bitness` is not one of 16, 32, 64.
*
* # Arguments
*
* * `bitness`: 16, 32, or 64
* * `target`: Target address
* @param {number} bitness
* @param {bigint} target
* @returns {Instruction}
*/
  static createXbegin(bitness: number, target: bigint): Instruction;
/**
* Creates a `OUTSB` instruction
*
* # Throws
*
* Throws if `addressSize` is not one of 16, 32, 64.
*
* # Arguments
*
* * `addressSize`: 16, 32, or 64
* * `segmentPrefix`: Segment override or [`Register.None`] (a [`Register`] enum value)
* * `repPrefix`: Rep prefix or [`RepPrefixKind.None`] (a [`RepPrefixKind`] enum value)
*
* [`Register.None`]: enum.Register.html#variant.None
* [`Register`]: enum.Register.html
* [`RepPrefixKind.None`]: enum.RepPrefixKind.html#variant.None
* [`RepPrefixKind`]: enum.RepPrefixKind.html
* @param {number} addressSize
* @param {Register} segmentPrefix
* @param {RepPrefixKind} repPrefix
* @returns {Instruction}
*/
  static createOutsb(addressSize: number, segmentPrefix: Register, repPrefix: RepPrefixKind): Instruction;
/**
* Creates a `REP OUTSB` instruction
*
* # Throws
*
* Throws if `addressSize` is not one of 16, 32, 64.
*
* # Arguments
*
* * `addressSize`: 16, 32, or 64
* @param {number} addressSize
* @returns {Instruction}
*/
  static createRepOutsb(addressSize: number): Instruction;
/**
* Creates a `OUTSW` instruction
*
* # Throws
*
* Throws if `addressSize` is not one of 16, 32, 64.
*
* # Arguments
*
* * `addressSize`: 16, 32, or 64
* * `segmentPrefix`: Segment override or [`Register.None`] (a [`Register`] enum value)
* * `repPrefix`: Rep prefix or [`RepPrefixKind.None`] (a [`RepPrefixKind`] enum value)
*
* [`Register.None`]: enum.Register.html#variant.None
* [`Register`]: enum.Register.html
* [`RepPrefixKind.None`]: enum.RepPrefixKind.html#variant.None
* [`RepPrefixKind`]: enum.RepPrefixKind.html
* @param {number} addressSize
* @param {Register} segmentPrefix
* @param {RepPrefixKind} repPrefix
* @returns {Instruction}
*/
  static createOutsw(addressSize: number, segmentPrefix: Register, repPrefix: RepPrefixKind): Instruction;
/**
* Creates a `REP OUTSW` instruction
*
* # Throws
*
* Throws if `addressSize` is not one of 16, 32, 64.
*
* # Arguments
*
* * `addressSize`: 16, 32, or 64
* @param {number} addressSize
* @returns {Instruction}
*/
  static createRepOutsw(addressSize: number): Instruction;
/**
* Creates a `OUTSD` instruction
*
* # Throws
*
* Throws if `addressSize` is not one of 16, 32, 64.
*
* # Arguments
*
* * `addressSize`: 16, 32, or 64
* * `segmentPrefix`: Segment override or [`Register.None`] (a [`Register`] enum value)
* * `repPrefix`: Rep prefix or [`RepPrefixKind.None`] (a [`RepPrefixKind`] enum value)
*
* [`Register.None`]: enum.Register.html#variant.None
* [`Register`]: enum.Register.html
* [`RepPrefixKind.None`]: enum.RepPrefixKind.html#variant.None
* [`RepPrefixKind`]: enum.RepPrefixKind.html
* @param {number} addressSize
* @param {Register} segmentPrefix
* @param {RepPrefixKind} repPrefix
* @returns {Instruction}
*/
  static createOutsd(addressSize: number, segmentPrefix: Register, repPrefix: RepPrefixKind): Instruction;
/**
* Creates a `REP OUTSD` instruction
*
* # Throws
*
* Throws if `addressSize` is not one of 16, 32, 64.
*
* # Arguments
*
* * `addressSize`: 16, 32, or 64
* @param {number} addressSize
* @returns {Instruction}
*/
  static createRepOutsd(addressSize: number): Instruction;
/**
* Creates a `LODSB` instruction
*
* # Throws
*
* Throws if `addressSize` is not one of 16, 32, 64.
*
* # Arguments
*
* * `addressSize`: 16, 32, or 64
* * `segmentPrefix`: Segment override or [`Register.None`] (a [`Register`] enum value)
* * `repPrefix`: Rep prefix or [`RepPrefixKind.None`] (a [`RepPrefixKind`] enum value)
*
* [`Register.None`]: enum.Register.html#variant.None
* [`Register`]: enum.Register.html
* [`RepPrefixKind.None`]: enum.RepPrefixKind.html#variant.None
* [`RepPrefixKind`]: enum.RepPrefixKind.html
* @param {number} addressSize
* @param {Register} segmentPrefix
* @param {RepPrefixKind} repPrefix
* @returns {Instruction}
*/
  static createLodsb(addressSize: number, segmentPrefix: Register, repPrefix: RepPrefixKind): Instruction;
/**
* Creates a `REP LODSB` instruction
*
* # Throws
*
* Throws if `addressSize` is not one of 16, 32, 64.
*
* # Arguments
*
* * `addressSize`: 16, 32, or 64
* @param {number} addressSize
* @returns {Instruction}
*/
  static createRepLodsb(addressSize: number): Instruction;
/**
* Creates a `LODSW` instruction
*
* # Throws
*
* Throws if `addressSize` is not one of 16, 32, 64.
*
* # Arguments
*
* * `addressSize`: 16, 32, or 64
* * `segmentPrefix`: Segment override or [`Register.None`] (a [`Register`] enum value)
* * `repPrefix`: Rep prefix or [`RepPrefixKind.None`] (a [`RepPrefixKind`] enum value)
*
* [`Register.None`]: enum.Register.html#variant.None
* [`Register`]: enum.Register.html
* [`RepPrefixKind.None`]: enum.RepPrefixKind.html#variant.None
* [`RepPrefixKind`]: enum.RepPrefixKind.html
* @param {number} addressSize
* @param {Register} segmentPrefix
* @param {RepPrefixKind} repPrefix
* @returns {Instruction}
*/
  static createLodsw(addressSize: number, segmentPrefix: Register, repPrefix: RepPrefixKind): Instruction;
/**
* Creates a `REP LODSW` instruction
*
* # Throws
*
* Throws if `addressSize` is not one of 16, 32, 64.
*
* # Arguments
*
* * `addressSize`: 16, 32, or 64
* @param {number} addressSize
* @returns {Instruction}
*/
  static createRepLodsw(addressSize: number): Instruction;
/**
* Creates a `LODSD` instruction
*
* # Throws
*
* Throws if `addressSize` is not one of 16, 32, 64.
*
* # Arguments
*
* * `addressSize`: 16, 32, or 64
* * `segmentPrefix`: Segment override or [`Register.None`] (a [`Register`] enum value)
* * `repPrefix`: Rep prefix or [`RepPrefixKind.None`] (a [`RepPrefixKind`] enum value)
*
* [`Register.None`]: enum.Register.html#variant.None
* [`Register`]: enum.Register.html
* [`RepPrefixKind.None`]: enum.RepPrefixKind.html#variant.None
* [`RepPrefixKind`]: enum.RepPrefixKind.html
* @param {number} addressSize
* @param {Register} segmentPrefix
* @param {RepPrefixKind} repPrefix
* @returns {Instruction}
*/
  static createLodsd(addressSize: number, segmentPrefix: Register, repPrefix: RepPrefixKind): Instruction;
/**
* Creates a `REP LODSD` instruction
*
* # Throws
*
* Throws if `addressSize` is not one of 16, 32, 64.
*
* # Arguments
*
* * `addressSize`: 16, 32, or 64
* @param {number} addressSize
* @returns {Instruction}
*/
  static createRepLodsd(addressSize: number): Instruction;
/**
* Creates a `LODSQ` instruction
*
* # Throws
*
* Throws if `addressSize` is not one of 16, 32, 64.
*
* # Arguments
*
* * `addressSize`: 16, 32, or 64
* * `segmentPrefix`: Segment override or [`Register.None`] (a [`Register`] enum value)
* * `repPrefix`: Rep prefix or [`RepPrefixKind.None`] (a [`RepPrefixKind`] enum value)
*
* [`Register.None`]: enum.Register.html#variant.None
* [`Register`]: enum.Register.html
* [`RepPrefixKind.None`]: enum.RepPrefixKind.html#variant.None
* [`RepPrefixKind`]: enum.RepPrefixKind.html
* @param {number} addressSize
* @param {Register} segmentPrefix
* @param {RepPrefixKind} repPrefix
* @returns {Instruction}
*/
  static createLodsq(addressSize: number, segmentPrefix: Register, repPrefix: RepPrefixKind): Instruction;
/**
* Creates a `REP LODSQ` instruction
*
* # Throws
*
* Throws if `addressSize` is not one of 16, 32, 64.
*
* # Arguments
*
* * `addressSize`: 16, 32, or 64
* @param {number} addressSize
* @returns {Instruction}
*/
  static createRepLodsq(addressSize: number): Instruction;
/**
* Creates a `SCASB` instruction
*
* # Throws
*
* Throws if `addressSize` is not one of 16, 32, 64.
*
* # Arguments
*
* * `addressSize`: 16, 32, or 64
* * `repPrefix`: Rep prefix or [`RepPrefixKind.None`] (a [`RepPrefixKind`] enum value)
*
* [`RepPrefixKind.None`]: enum.RepPrefixKind.html#variant.None
* [`RepPrefixKind`]: enum.RepPrefixKind.html
* @param {number} addressSize
* @param {RepPrefixKind} repPrefix
* @returns {Instruction}
*/
  static createScasb(addressSize: number, repPrefix: RepPrefixKind): Instruction;
/**
* Creates a `REPE SCASB` instruction
*
* # Throws
*
* Throws if `addressSize` is not one of 16, 32, 64.
*
* # Arguments
*
* * `addressSize`: 16, 32, or 64
* @param {number} addressSize
* @returns {Instruction}
*/
  static createRepeScasb(addressSize: number): Instruction;
/**
* Creates a `REPNE SCASB` instruction
*
* # Throws
*
* Throws if `addressSize` is not one of 16, 32, 64.
*
* # Arguments
*
* * `addressSize`: 16, 32, or 64
* @param {number} addressSize
* @returns {Instruction}
*/
  static createRepneScasb(addressSize: number): Instruction;
/**
* Creates a `SCASW` instruction
*
* # Throws
*
* Throws if `addressSize` is not one of 16, 32, 64.
*
* # Arguments
*
* * `addressSize`: 16, 32, or 64
* * `repPrefix`: Rep prefix or [`RepPrefixKind.None`] (a [`RepPrefixKind`] enum value)
*
* [`RepPrefixKind.None`]: enum.RepPrefixKind.html#variant.None
* [`RepPrefixKind`]: enum.RepPrefixKind.html
* @param {number} addressSize
* @param {RepPrefixKind} repPrefix
* @returns {Instruction}
*/
  static createScasw(addressSize: number, repPrefix: RepPrefixKind): Instruction;
/**
* Creates a `REPE SCASW` instruction
*
* # Throws
*
* Throws if `addressSize` is not one of 16, 32, 64.
*
* # Arguments
*
* * `addressSize`: 16, 32, or 64
* @param {number} addressSize
* @returns {Instruction}
*/
  static createRepeScasw(addressSize: number): Instruction;
/**
* Creates a `REPNE SCASW` instruction
*
* # Throws
*
* Throws if `addressSize` is not one of 16, 32, 64.
*
* # Arguments
*
* * `addressSize`: 16, 32, or 64
* @param {number} addressSize
* @returns {Instruction}
*/
  static createRepneScasw(addressSize: number): Instruction;
/**
* Creates a `SCASD` instruction
*
* # Throws
*
* Throws if `addressSize` is not one of 16, 32, 64.
*
* # Arguments
*
* * `addressSize`: 16, 32, or 64
* * `repPrefix`: Rep prefix or [`RepPrefixKind.None`] (a [`RepPrefixKind`] enum value)
*
* [`RepPrefixKind.None`]: enum.RepPrefixKind.html#variant.None
* [`RepPrefixKind`]: enum.RepPrefixKind.html
* @param {number} addressSize
* @param {RepPrefixKind} repPrefix
* @returns {Instruction}
*/
  static createScasd(addressSize: number, repPrefix: RepPrefixKind): Instruction;
/**
* Creates a `REPE SCASD` instruction
*
* # Throws
*
* Throws if `addressSize` is not one of 16, 32, 64.
*
* # Arguments
*
* * `addressSize`: 16, 32, or 64
* @param {number} addressSize
* @returns {Instruction}
*/
  static createRepeScasd(addressSize: number): Instruction;
/**
* Creates a `REPNE SCASD` instruction
*
* # Throws
*
* Throws if `addressSize` is not one of 16, 32, 64.
*
* # Arguments
*
* * `addressSize`: 16, 32, or 64
* @param {number} addressSize
* @returns {Instruction}
*/
  static createRepneScasd(addressSize: number): Instruction;
/**
* Creates a `SCASQ` instruction
*
* # Throws
*
* Throws if `addressSize` is not one of 16, 32, 64.
*
* # Arguments
*
* * `addressSize`: 16, 32, or 64
* * `repPrefix`: Rep prefix or [`RepPrefixKind.None`] (a [`RepPrefixKind`] enum value)
*
* [`RepPrefixKind.None`]: enum.RepPrefixKind.html#variant.None
* [`RepPrefixKind`]: enum.RepPrefixKind.html
* @param {number} addressSize
* @param {RepPrefixKind} repPrefix
* @returns {Instruction}
*/
  static createScasq(addressSize: number, repPrefix: RepPrefixKind): Instruction;
/**
* Creates a `REPE SCASQ` instruction
*
* # Throws
*
* Throws if `addressSize` is not one of 16, 32, 64.
*
* # Arguments
*
* * `addressSize`: 16, 32, or 64
* @param {number} addressSize
* @returns {Instruction}
*/
  static createRepeScasq(addressSize: number): Instruction;
/**
* Creates a `REPNE SCASQ` instruction
*
* # Throws
*
* Throws if `addressSize` is not one of 16, 32, 64.
*
* # Arguments
*
* * `addressSize`: 16, 32, or 64
* @param {number} addressSize
* @returns {Instruction}
*/
  static createRepneScasq(addressSize: number): Instruction;
/**
* Creates a `INSB` instruction
*
* # Throws
*
* Throws if `addressSize` is not one of 16, 32, 64.
*
* # Arguments
*
* * `addressSize`: 16, 32, or 64
* * `repPrefix`: Rep prefix or [`RepPrefixKind.None`] (a [`RepPrefixKind`] enum value)
*
* [`RepPrefixKind.None`]: enum.RepPrefixKind.html#variant.None
* [`RepPrefixKind`]: enum.RepPrefixKind.html
* @param {number} addressSize
* @param {RepPrefixKind} repPrefix
* @returns {Instruction}
*/
  static createInsb(addressSize: number, repPrefix: RepPrefixKind): Instruction;
/**
* Creates a `REP INSB` instruction
*
* # Throws
*
* Throws if `addressSize` is not one of 16, 32, 64.
*
* # Arguments
*
* * `addressSize`: 16, 32, or 64
* @param {number} addressSize
* @returns {Instruction}
*/
  static createRepInsb(addressSize: number): Instruction;
/**
* Creates a `INSW` instruction
*
* # Throws
*
* Throws if `addressSize` is not one of 16, 32, 64.
*
* # Arguments
*
* * `addressSize`: 16, 32, or 64
* * `repPrefix`: Rep prefix or [`RepPrefixKind.None`] (a [`RepPrefixKind`] enum value)
*
* [`RepPrefixKind.None`]: enum.RepPrefixKind.html#variant.None
* [`RepPrefixKind`]: enum.RepPrefixKind.html
* @param {number} addressSize
* @param {RepPrefixKind} repPrefix
* @returns {Instruction}
*/
  static createInsw(addressSize: number, repPrefix: RepPrefixKind): Instruction;
/**
* Creates a `REP INSW` instruction
*
* # Throws
*
* Throws if `addressSize` is not one of 16, 32, 64.
*
* # Arguments
*
* * `addressSize`: 16, 32, or 64
* @param {number} addressSize
* @returns {Instruction}
*/
  static createRepInsw(addressSize: number): Instruction;
/**
* Creates a `INSD` instruction
*
* # Throws
*
* Throws if `addressSize` is not one of 16, 32, 64.
*
* # Arguments
*
* * `addressSize`: 16, 32, or 64
* * `repPrefix`: Rep prefix or [`RepPrefixKind.None`] (a [`RepPrefixKind`] enum value)
*
* [`RepPrefixKind.None`]: enum.RepPrefixKind.html#variant.None
* [`RepPrefixKind`]: enum.RepPrefixKind.html
* @param {number} addressSize
* @param {RepPrefixKind} repPrefix
* @returns {Instruction}
*/
  static createInsd(addressSize: number, repPrefix: RepPrefixKind): Instruction;
/**
* Creates a `REP INSD` instruction
*
* # Throws
*
* Throws if `addressSize` is not one of 16, 32, 64.
*
* # Arguments
*
* * `addressSize`: 16, 32, or 64
* @param {number} addressSize
* @returns {Instruction}
*/
  static createRepInsd(addressSize: number): Instruction;
/**
* Creates a `STOSB` instruction
*
* # Throws
*
* Throws if `addressSize` is not one of 16, 32, 64.
*
* # Arguments
*
* * `addressSize`: 16, 32, or 64
* * `repPrefix`: Rep prefix or [`RepPrefixKind.None`] (a [`RepPrefixKind`] enum value)
*
* [`RepPrefixKind.None`]: enum.RepPrefixKind.html#variant.None
* [`RepPrefixKind`]: enum.RepPrefixKind.html
* @param {number} addressSize
* @param {RepPrefixKind} repPrefix
* @returns {Instruction}
*/
  static createStosb(addressSize: number, repPrefix: RepPrefixKind): Instruction;
/**
* Creates a `REP STOSB` instruction
*
* # Throws
*
* Throws if `addressSize` is not one of 16, 32, 64.
*
* # Arguments
*
* * `addressSize`: 16, 32, or 64
* @param {number} addressSize
* @returns {Instruction}
*/
  static createRepStosb(addressSize: number): Instruction;
/**
* Creates a `STOSW` instruction
*
* # Throws
*
* Throws if `addressSize` is not one of 16, 32, 64.
*
* # Arguments
*
* * `addressSize`: 16, 32, or 64
* * `repPrefix`: Rep prefix or [`RepPrefixKind.None`] (a [`RepPrefixKind`] enum value)
*
* [`RepPrefixKind.None`]: enum.RepPrefixKind.html#variant.None
* [`RepPrefixKind`]: enum.RepPrefixKind.html
* @param {number} addressSize
* @param {RepPrefixKind} repPrefix
* @returns {Instruction}
*/
  static createStosw(addressSize: number, repPrefix: RepPrefixKind): Instruction;
/**
* Creates a `REP STOSW` instruction
*
* # Throws
*
* Throws if `addressSize` is not one of 16, 32, 64.
*
* # Arguments
*
* * `addressSize`: 16, 32, or 64
* @param {number} addressSize
* @returns {Instruction}
*/
  static createRepStosw(addressSize: number): Instruction;
/**
* Creates a `STOSD` instruction
*
* # Throws
*
* Throws if `addressSize` is not one of 16, 32, 64.
*
* # Arguments
*
* * `addressSize`: 16, 32, or 64
* * `repPrefix`: Rep prefix or [`RepPrefixKind.None`] (a [`RepPrefixKind`] enum value)
*
* [`RepPrefixKind.None`]: enum.RepPrefixKind.html#variant.None
* [`RepPrefixKind`]: enum.RepPrefixKind.html
* @param {number} addressSize
* @param {RepPrefixKind} repPrefix
* @returns {Instruction}
*/
  static createStosd(addressSize: number, repPrefix: RepPrefixKind): Instruction;
/**
* Creates a `REP STOSD` instruction
*
* # Throws
*
* Throws if `addressSize` is not one of 16, 32, 64.
*
* # Arguments
*
* * `addressSize`: 16, 32, or 64
* @param {number} addressSize
* @returns {Instruction}
*/
  static createRepStosd(addressSize: number): Instruction;
/**
* Creates a `STOSQ` instruction
*
* # Throws
*
* Throws if `addressSize` is not one of 16, 32, 64.
*
* # Arguments
*
* * `addressSize`: 16, 32, or 64
* * `repPrefix`: Rep prefix or [`RepPrefixKind.None`] (a [`RepPrefixKind`] enum value)
*
* [`RepPrefixKind.None`]: enum.RepPrefixKind.html#variant.None
* [`RepPrefixKind`]: enum.RepPrefixKind.html
* @param {number} addressSize
* @param {RepPrefixKind} repPrefix
* @returns {Instruction}
*/
  static createStosq(addressSize: number, repPrefix: RepPrefixKind): Instruction;
/**
* Creates a `REP STOSQ` instruction
*
* # Throws
*
* Throws if `addressSize` is not one of 16, 32, 64.
*
* # Arguments
*
* * `addressSize`: 16, 32, or 64
* @param {number} addressSize
* @returns {Instruction}
*/
  static createRepStosq(addressSize: number): Instruction;
/**
* Creates a `CMPSB` instruction
*
* # Throws
*
* Throws if `addressSize` is not one of 16, 32, 64.
*
* # Arguments
*
* * `addressSize`: 16, 32, or 64
* * `segmentPrefix`: Segment override or [`Register.None`] (a [`Register`] enum value)
* * `repPrefix`: Rep prefix or [`RepPrefixKind.None`] (a [`RepPrefixKind`] enum value)
*
* [`Register.None`]: enum.Register.html#variant.None
* [`Register`]: enum.Register.html
* [`RepPrefixKind.None`]: enum.RepPrefixKind.html#variant.None
* [`RepPrefixKind`]: enum.RepPrefixKind.html
* @param {number} addressSize
* @param {Register} segmentPrefix
* @param {RepPrefixKind} repPrefix
* @returns {Instruction}
*/
  static createCmpsb(addressSize: number, segmentPrefix: Register, repPrefix: RepPrefixKind): Instruction;
/**
* Creates a `REPE CMPSB` instruction
*
* # Throws
*
* Throws if `addressSize` is not one of 16, 32, 64.
*
* # Arguments
*
* * `addressSize`: 16, 32, or 64
* @param {number} addressSize
* @returns {Instruction}
*/
  static createRepeCmpsb(addressSize: number): Instruction;
/**
* Creates a `REPNE CMPSB` instruction
*
* # Throws
*
* Throws if `addressSize` is not one of 16, 32, 64.
*
* # Arguments
*
* * `addressSize`: 16, 32, or 64
* @param {number} addressSize
* @returns {Instruction}
*/
  static createRepneCmpsb(addressSize: number): Instruction;
/**
* Creates a `CMPSW` instruction
*
* # Throws
*
* Throws if `addressSize` is not one of 16, 32, 64.
*
* # Arguments
*
* * `addressSize`: 16, 32, or 64
* * `segmentPrefix`: Segment override or [`Register.None`] (a [`Register`] enum value)
* * `repPrefix`: Rep prefix or [`RepPrefixKind.None`] (a [`RepPrefixKind`] enum value)
*
* [`Register.None`]: enum.Register.html#variant.None
* [`Register`]: enum.Register.html
* [`RepPrefixKind.None`]: enum.RepPrefixKind.html#variant.None
* [`RepPrefixKind`]: enum.RepPrefixKind.html
* @param {number} addressSize
* @param {Register} segmentPrefix
* @param {RepPrefixKind} repPrefix
* @returns {Instruction}
*/
  static createCmpsw(addressSize: number, segmentPrefix: Register, repPrefix: RepPrefixKind): Instruction;
/**
* Creates a `REPE CMPSW` instruction
*
* # Throws
*
* Throws if `addressSize` is not one of 16, 32, 64.
*
* # Arguments
*
* * `addressSize`: 16, 32, or 64
* @param {number} addressSize
* @returns {Instruction}
*/
  static createRepeCmpsw(addressSize: number): Instruction;
/**
* Creates a `REPNE CMPSW` instruction
*
* # Throws
*
* Throws if `addressSize` is not one of 16, 32, 64.
*
* # Arguments
*
* * `addressSize`: 16, 32, or 64
* @param {number} addressSize
* @returns {Instruction}
*/
  static createRepneCmpsw(addressSize: number): Instruction;
/**
* Creates a `CMPSD` instruction
*
* # Throws
*
* Throws if `addressSize` is not one of 16, 32, 64.
*
* # Arguments
*
* * `addressSize`: 16, 32, or 64
* * `segmentPrefix`: Segment override or [`Register.None`] (a [`Register`] enum value)
* * `repPrefix`: Rep prefix or [`RepPrefixKind.None`] (a [`RepPrefixKind`] enum value)
*
* [`Register.None`]: enum.Register.html#variant.None
* [`Register`]: enum.Register.html
* [`RepPrefixKind.None`]: enum.RepPrefixKind.html#variant.None
* [`RepPrefixKind`]: enum.RepPrefixKind.html
* @param {number} addressSize
* @param {Register} segmentPrefix
* @param {RepPrefixKind} repPrefix
* @returns {Instruction}
*/
  static createCmpsd(addressSize: number, segmentPrefix: Register, repPrefix: RepPrefixKind): Instruction;
/**
* Creates a `REPE CMPSD` instruction
*
* # Throws
*
* Throws if `addressSize` is not one of 16, 32, 64.
*
* # Arguments
*
* * `addressSize`: 16, 32, or 64
* @param {number} addressSize
* @returns {Instruction}
*/
  static createRepeCmpsd(addressSize: number): Instruction;
/**
* Creates a `REPNE CMPSD` instruction
*
* # Throws
*
* Throws if `addressSize` is not one of 16, 32, 64.
*
* # Arguments
*
* * `addressSize`: 16, 32, or 64
* @param {number} addressSize
* @returns {Instruction}
*/
  static createRepneCmpsd(addressSize: number): Instruction;
/**
* Creates a `CMPSQ` instruction
*
* # Throws
*
* Throws if `addressSize` is not one of 16, 32, 64.
*
* # Arguments
*
* * `addressSize`: 16, 32, or 64
* * `segmentPrefix`: Segment override or [`Register.None`] (a [`Register`] enum value)
* * `repPrefix`: Rep prefix or [`RepPrefixKind.None`] (a [`RepPrefixKind`] enum value)
*
* [`Register.None`]: enum.Register.html#variant.None
* [`Register`]: enum.Register.html
* [`RepPrefixKind.None`]: enum.RepPrefixKind.html#variant.None
* [`RepPrefixKind`]: enum.RepPrefixKind.html
* @param {number} addressSize
* @param {Register} segmentPrefix
* @param {RepPrefixKind} repPrefix
* @returns {Instruction}
*/
  static createCmpsq(addressSize: number, segmentPrefix: Register, repPrefix: RepPrefixKind): Instruction;
/**
* Creates a `REPE CMPSQ` instruction
*
* # Throws
*
* Throws if `addressSize` is not one of 16, 32, 64.
*
* # Arguments
*
* * `addressSize`: 16, 32, or 64
* @param {number} addressSize
* @returns {Instruction}
*/
  static createRepeCmpsq(addressSize: number): Instruction;
/**
* Creates a `REPNE CMPSQ` instruction
*
* # Throws
*
* Throws if `addressSize` is not one of 16, 32, 64.
*
* # Arguments
*
* * `addressSize`: 16, 32, or 64
* @param {number} addressSize
* @returns {Instruction}
*/
  static createRepneCmpsq(addressSize: number): Instruction;
/**
* Creates a `MOVSB` instruction
*
* # Throws
*
* Throws if `addressSize` is not one of 16, 32, 64.
*
* # Arguments
*
* * `addressSize`: 16, 32, or 64
* * `segmentPrefix`: Segment override or [`Register.None`] (a [`Register`] enum value)
* * `repPrefix`: Rep prefix or [`RepPrefixKind.None`] (a [`RepPrefixKind`] enum value)
*
* [`Register.None`]: enum.Register.html#variant.None
* [`Register`]: enum.Register.html
* [`RepPrefixKind.None`]: enum.RepPrefixKind.html#variant.None
* [`RepPrefixKind`]: enum.RepPrefixKind.html
* @param {number} addressSize
* @param {Register} segmentPrefix
* @param {RepPrefixKind} repPrefix
* @returns {Instruction}
*/
  static createMovsb(addressSize: number, segmentPrefix: Register, repPrefix: RepPrefixKind): Instruction;
/**
* Creates a `REP MOVSB` instruction
*
* # Throws
*
* Throws if `addressSize` is not one of 16, 32, 64.
*
* # Arguments
*
* * `addressSize`: 16, 32, or 64
* @param {number} addressSize
* @returns {Instruction}
*/
  static createRepMovsb(addressSize: number): Instruction;
/**
* Creates a `MOVSW` instruction
*
* # Throws
*
* Throws if `addressSize` is not one of 16, 32, 64.
*
* # Arguments
*
* * `addressSize`: 16, 32, or 64
* * `segmentPrefix`: Segment override or [`Register.None`] (a [`Register`] enum value)
* * `repPrefix`: Rep prefix or [`RepPrefixKind.None`] (a [`RepPrefixKind`] enum value)
*
* [`Register.None`]: enum.Register.html#variant.None
* [`Register`]: enum.Register.html
* [`RepPrefixKind.None`]: enum.RepPrefixKind.html#variant.None
* [`RepPrefixKind`]: enum.RepPrefixKind.html
* @param {number} addressSize
* @param {Register} segmentPrefix
* @param {RepPrefixKind} repPrefix
* @returns {Instruction}
*/
  static createMovsw(addressSize: number, segmentPrefix: Register, repPrefix: RepPrefixKind): Instruction;
/**
* Creates a `REP MOVSW` instruction
*
* # Throws
*
* Throws if `addressSize` is not one of 16, 32, 64.
*
* # Arguments
*
* * `addressSize`: 16, 32, or 64
* @param {number} addressSize
* @returns {Instruction}
*/
  static createRepMovsw(addressSize: number): Instruction;
/**
* Creates a `MOVSD` instruction
*
* # Throws
*
* Throws if `addressSize` is not one of 16, 32, 64.
*
* # Arguments
*
* * `addressSize`: 16, 32, or 64
* * `segmentPrefix`: Segment override or [`Register.None`] (a [`Register`] enum value)
* * `repPrefix`: Rep prefix or [`RepPrefixKind.None`] (a [`RepPrefixKind`] enum value)
*
* [`Register.None`]: enum.Register.html#variant.None
* [`Register`]: enum.Register.html
* [`RepPrefixKind.None`]: enum.RepPrefixKind.html#variant.None
* [`RepPrefixKind`]: enum.RepPrefixKind.html
* @param {number} addressSize
* @param {Register} segmentPrefix
* @param {RepPrefixKind} repPrefix
* @returns {Instruction}
*/
  static createMovsd(addressSize: number, segmentPrefix: Register, repPrefix: RepPrefixKind): Instruction;
/**
* Creates a `REP MOVSD` instruction
*
* # Throws
*
* Throws if `addressSize` is not one of 16, 32, 64.
*
* # Arguments
*
* * `addressSize`: 16, 32, or 64
* @param {number} addressSize
* @returns {Instruction}
*/
  static createRepMovsd(addressSize: number): Instruction;
/**
* Creates a `MOVSQ` instruction
*
* # Throws
*
* Throws if `addressSize` is not one of 16, 32, 64.
*
* # Arguments
*
* * `addressSize`: 16, 32, or 64
* * `segmentPrefix`: Segment override or [`Register.None`] (a [`Register`] enum value)
* * `repPrefix`: Rep prefix or [`RepPrefixKind.None`] (a [`RepPrefixKind`] enum value)
*
* [`Register.None`]: enum.Register.html#variant.None
* [`Register`]: enum.Register.html
* [`RepPrefixKind.None`]: enum.RepPrefixKind.html#variant.None
* [`RepPrefixKind`]: enum.RepPrefixKind.html
* @param {number} addressSize
* @param {Register} segmentPrefix
* @param {RepPrefixKind} repPrefix
* @returns {Instruction}
*/
  static createMovsq(addressSize: number, segmentPrefix: Register, repPrefix: RepPrefixKind): Instruction;
/**
* Creates a `REP MOVSQ` instruction
*
* # Throws
*
* Throws if `addressSize` is not one of 16, 32, 64.
*
* # Arguments
*
* * `addressSize`: 16, 32, or 64
* @param {number} addressSize
* @returns {Instruction}
*/
  static createRepMovsq(addressSize: number): Instruction;
/**
* Creates a `MASKMOVQ` instruction
*
* # Throws
*
* Throws if `addressSize` is not one of 16, 32, 64.
*
* # Arguments
*
* * `addressSize`: 16, 32, or 64
* * `register1`: Register (a [`Register`] enum value)
* * `register2`: Register (a [`Register`] enum value)
* * `segmentPrefix`: Segment override or [`Register.None`] (a [`Register`] enum value)
*
* [`Register`]: enum.Register.html
* [`Register.None`]: enum.Register.html#variant.None
* @param {number} addressSize
* @param {Register} register1
* @param {Register} register2
* @param {Register} segmentPrefix
* @returns {Instruction}
*/
  static createMaskmovq(addressSize: number, register1: Register, register2: Register, segmentPrefix: Register): Instruction;
/**
* Creates a `MASKMOVDQU` instruction
*
* # Throws
*
* Throws if `addressSize` is not one of 16, 32, 64.
*
* # Arguments
*
* * `addressSize`: 16, 32, or 64
* * `register1`: Register (a [`Register`] enum value)
* * `register2`: Register (a [`Register`] enum value)
* * `segmentPrefix`: Segment override or [`Register.None`] (a [`Register`] enum value)
*
* [`Register`]: enum.Register.html
* [`Register.None`]: enum.Register.html#variant.None
* @param {number} addressSize
* @param {Register} register1
* @param {Register} register2
* @param {Register} segmentPrefix
* @returns {Instruction}
*/
  static createMaskmovdqu(addressSize: number, register1: Register, register2: Register, segmentPrefix: Register): Instruction;
/**
* Creates a `VMASKMOVDQU` instruction
*
* # Throws
*
* Throws if `addressSize` is not one of 16, 32, 64.
*
* # Arguments
*
* * `addressSize`: 16, 32, or 64
* * `register1`: Register (a [`Register`] enum value)
* * `register2`: Register (a [`Register`] enum value)
* * `segmentPrefix`: Segment override or [`Register.None`] (a [`Register`] enum value)
*
* [`Register`]: enum.Register.html
* [`Register.None`]: enum.Register.html#variant.None
* @param {number} addressSize
* @param {Register} register1
* @param {Register} register2
* @param {Register} segmentPrefix
* @returns {Instruction}
*/
  static createVmaskmovdqu(addressSize: number, register1: Register, register2: Register, segmentPrefix: Register): Instruction;
/**
* Creates a `db`/`.byte` asm directive
*
* # Arguments
*
* * `b0`: Byte 0
* @param {number} b0
* @returns {Instruction}
*/
  static createDeclareByte_1(b0: number): Instruction;
/**
* Creates a `db`/`.byte` asm directive
*
* # Arguments
*
* * `b0`: Byte 0
* * `b1`: Byte 1
* @param {number} b0
* @param {number} b1
* @returns {Instruction}
*/
  static createDeclareByte_2(b0: number, b1: number): Instruction;
/**
* Creates a `db`/`.byte` asm directive
*
* # Arguments
*
* * `b0`: Byte 0
* * `b1`: Byte 1
* * `b2`: Byte 2
* @param {number} b0
* @param {number} b1
* @param {number} b2
* @returns {Instruction}
*/
  static createDeclareByte_3(b0: number, b1: number, b2: number): Instruction;
/**
* Creates a `db`/`.byte` asm directive
*
* # Arguments
*
* * `b0`: Byte 0
* * `b1`: Byte 1
* * `b2`: Byte 2
* * `b3`: Byte 3
* @param {number} b0
* @param {number} b1
* @param {number} b2
* @param {number} b3
* @returns {Instruction}
*/
  static createDeclareByte_4(b0: number, b1: number, b2: number, b3: number): Instruction;
/**
* Creates a `db`/`.byte` asm directive
*
* # Arguments
*
* * `b0`: Byte 0
* * `b1`: Byte 1
* * `b2`: Byte 2
* * `b3`: Byte 3
* * `b4`: Byte 4
* @param {number} b0
* @param {number} b1
* @param {number} b2
* @param {number} b3
* @param {number} b4
* @returns {Instruction}
*/
  static createDeclareByte_5(b0: number, b1: number, b2: number, b3: number, b4: number): Instruction;
/**
* Creates a `db`/`.byte` asm directive
*
* # Arguments
*
* * `b0`: Byte 0
* * `b1`: Byte 1
* * `b2`: Byte 2
* * `b3`: Byte 3
* * `b4`: Byte 4
* * `b5`: Byte 5
* @param {number} b0
* @param {number} b1
* @param {number} b2
* @param {number} b3
* @param {number} b4
* @param {number} b5
* @returns {Instruction}
*/
  static createDeclareByte_6(b0: number, b1: number, b2: number, b3: number, b4: number, b5: number): Instruction;
/**
* Creates a `db`/`.byte` asm directive
*
* # Arguments
*
* * `b0`: Byte 0
* * `b1`: Byte 1
* * `b2`: Byte 2
* * `b3`: Byte 3
* * `b4`: Byte 4
* * `b5`: Byte 5
* * `b6`: Byte 6
* @param {number} b0
* @param {number} b1
* @param {number} b2
* @param {number} b3
* @param {number} b4
* @param {number} b5
* @param {number} b6
* @returns {Instruction}
*/
  static createDeclareByte_7(b0: number, b1: number, b2: number, b3: number, b4: number, b5: number, b6: number): Instruction;
/**
* Creates a `db`/`.byte` asm directive
*
* # Arguments
*
* * `b0`: Byte 0
* * `b1`: Byte 1
* * `b2`: Byte 2
* * `b3`: Byte 3
* * `b4`: Byte 4
* * `b5`: Byte 5
* * `b6`: Byte 6
* * `b7`: Byte 7
* @param {number} b0
* @param {number} b1
* @param {number} b2
* @param {number} b3
* @param {number} b4
* @param {number} b5
* @param {number} b6
* @param {number} b7
* @returns {Instruction}
*/
  static createDeclareByte_8(b0: number, b1: number, b2: number, b3: number, b4: number, b5: number, b6: number, b7: number): Instruction;
/**
* Creates a `db`/`.byte` asm directive
*
* # Arguments
*
* * `b0`: Byte 0
* * `b1`: Byte 1
* * `b2`: Byte 2
* * `b3`: Byte 3
* * `b4`: Byte 4
* * `b5`: Byte 5
* * `b6`: Byte 6
* * `b7`: Byte 7
* * `b8`: Byte 8
* @param {number} b0
* @param {number} b1
* @param {number} b2
* @param {number} b3
* @param {number} b4
* @param {number} b5
* @param {number} b6
* @param {number} b7
* @param {number} b8
* @returns {Instruction}
*/
  static createDeclareByte_9(b0: number, b1: number, b2: number, b3: number, b4: number, b5: number, b6: number, b7: number, b8: number): Instruction;
/**
* Creates a `db`/`.byte` asm directive
*
* # Arguments
*
* * `b0`: Byte 0
* * `b1`: Byte 1
* * `b2`: Byte 2
* * `b3`: Byte 3
* * `b4`: Byte 4
* * `b5`: Byte 5
* * `b6`: Byte 6
* * `b7`: Byte 7
* * `b8`: Byte 8
* * `b9`: Byte 9
* @param {number} b0
* @param {number} b1
* @param {number} b2
* @param {number} b3
* @param {number} b4
* @param {number} b5
* @param {number} b6
* @param {number} b7
* @param {number} b8
* @param {number} b9
* @returns {Instruction}
*/
  static createDeclareByte_10(b0: number, b1: number, b2: number, b3: number, b4: number, b5: number, b6: number, b7: number, b8: number, b9: number): Instruction;
/**
* Creates a `db`/`.byte` asm directive
*
* # Arguments
*
* * `b0`: Byte 0
* * `b1`: Byte 1
* * `b2`: Byte 2
* * `b3`: Byte 3
* * `b4`: Byte 4
* * `b5`: Byte 5
* * `b6`: Byte 6
* * `b7`: Byte 7
* * `b8`: Byte 8
* * `b9`: Byte 9
* * `b10`: Byte 10
* @param {number} b0
* @param {number} b1
* @param {number} b2
* @param {number} b3
* @param {number} b4
* @param {number} b5
* @param {number} b6
* @param {number} b7
* @param {number} b8
* @param {number} b9
* @param {number} b10
* @returns {Instruction}
*/
  static createDeclareByte_11(b0: number, b1: number, b2: number, b3: number, b4: number, b5: number, b6: number, b7: number, b8: number, b9: number, b10: number): Instruction;
/**
* Creates a `db`/`.byte` asm directive
*
* # Arguments
*
* * `b0`: Byte 0
* * `b1`: Byte 1
* * `b2`: Byte 2
* * `b3`: Byte 3
* * `b4`: Byte 4
* * `b5`: Byte 5
* * `b6`: Byte 6
* * `b7`: Byte 7
* * `b8`: Byte 8
* * `b9`: Byte 9
* * `b10`: Byte 10
* * `b11`: Byte 11
* @param {number} b0
* @param {number} b1
* @param {number} b2
* @param {number} b3
* @param {number} b4
* @param {number} b5
* @param {number} b6
* @param {number} b7
* @param {number} b8
* @param {number} b9
* @param {number} b10
* @param {number} b11
* @returns {Instruction}
*/
  static createDeclareByte_12(b0: number, b1: number, b2: number, b3: number, b4: number, b5: number, b6: number, b7: number, b8: number, b9: number, b10: number, b11: number): Instruction;
/**
* Creates a `db`/`.byte` asm directive
*
* # Arguments
*
* * `b0`: Byte 0
* * `b1`: Byte 1
* * `b2`: Byte 2
* * `b3`: Byte 3
* * `b4`: Byte 4
* * `b5`: Byte 5
* * `b6`: Byte 6
* * `b7`: Byte 7
* * `b8`: Byte 8
* * `b9`: Byte 9
* * `b10`: Byte 10
* * `b11`: Byte 11
* * `b12`: Byte 12
* @param {number} b0
* @param {number} b1
* @param {number} b2
* @param {number} b3
* @param {number} b4
* @param {number} b5
* @param {number} b6
* @param {number} b7
* @param {number} b8
* @param {number} b9
* @param {number} b10
* @param {number} b11
* @param {number} b12
* @returns {Instruction}
*/
  static createDeclareByte_13(b0: number, b1: number, b2: number, b3: number, b4: number, b5: number, b6: number, b7: number, b8: number, b9: number, b10: number, b11: number, b12: number): Instruction;
/**
* Creates a `db`/`.byte` asm directive
*
* # Arguments
*
* * `b0`: Byte 0
* * `b1`: Byte 1
* * `b2`: Byte 2
* * `b3`: Byte 3
* * `b4`: Byte 4
* * `b5`: Byte 5
* * `b6`: Byte 6
* * `b7`: Byte 7
* * `b8`: Byte 8
* * `b9`: Byte 9
* * `b10`: Byte 10
* * `b11`: Byte 11
* * `b12`: Byte 12
* * `b13`: Byte 13
* @param {number} b0
* @param {number} b1
* @param {number} b2
* @param {number} b3
* @param {number} b4
* @param {number} b5
* @param {number} b6
* @param {number} b7
* @param {number} b8
* @param {number} b9
* @param {number} b10
* @param {number} b11
* @param {number} b12
* @param {number} b13
* @returns {Instruction}
*/
  static createDeclareByte_14(b0: number, b1: number, b2: number, b3: number, b4: number, b5: number, b6: number, b7: number, b8: number, b9: number, b10: number, b11: number, b12: number, b13: number): Instruction;
/**
* Creates a `db`/`.byte` asm directive
*
* # Arguments
*
* * `b0`: Byte 0
* * `b1`: Byte 1
* * `b2`: Byte 2
* * `b3`: Byte 3
* * `b4`: Byte 4
* * `b5`: Byte 5
* * `b6`: Byte 6
* * `b7`: Byte 7
* * `b8`: Byte 8
* * `b9`: Byte 9
* * `b10`: Byte 10
* * `b11`: Byte 11
* * `b12`: Byte 12
* * `b13`: Byte 13
* * `b14`: Byte 14
* @param {number} b0
* @param {number} b1
* @param {number} b2
* @param {number} b3
* @param {number} b4
* @param {number} b5
* @param {number} b6
* @param {number} b7
* @param {number} b8
* @param {number} b9
* @param {number} b10
* @param {number} b11
* @param {number} b12
* @param {number} b13
* @param {number} b14
* @returns {Instruction}
*/
  static createDeclareByte_15(b0: number, b1: number, b2: number, b3: number, b4: number, b5: number, b6: number, b7: number, b8: number, b9: number, b10: number, b11: number, b12: number, b13: number, b14: number): Instruction;
/**
* Creates a `db`/`.byte` asm directive
*
* # Arguments
*
* * `b0`: Byte 0
* * `b1`: Byte 1
* * `b2`: Byte 2
* * `b3`: Byte 3
* * `b4`: Byte 4
* * `b5`: Byte 5
* * `b6`: Byte 6
* * `b7`: Byte 7
* * `b8`: Byte 8
* * `b9`: Byte 9
* * `b10`: Byte 10
* * `b11`: Byte 11
* * `b12`: Byte 12
* * `b13`: Byte 13
* * `b14`: Byte 14
* * `b15`: Byte 15
* @param {number} b0
* @param {number} b1
* @param {number} b2
* @param {number} b3
* @param {number} b4
* @param {number} b5
* @param {number} b6
* @param {number} b7
* @param {number} b8
* @param {number} b9
* @param {number} b10
* @param {number} b11
* @param {number} b12
* @param {number} b13
* @param {number} b14
* @param {number} b15
* @returns {Instruction}
*/
  static createDeclareByte_16(b0: number, b1: number, b2: number, b3: number, b4: number, b5: number, b6: number, b7: number, b8: number, b9: number, b10: number, b11: number, b12: number, b13: number, b14: number, b15: number): Instruction;
/**
* Creates a `db`/`.byte` asm directive
*
* # Throws
*
* Throws if `data.length` is not 1-16
*
* # Arguments
*
* * `data`: Data
* @param {Uint8Array} data
* @returns {Instruction}
*/
  static createDeclareByte(data: Uint8Array): Instruction;
/**
* Creates a `dw`/`.word` asm directive
*
* # Arguments
*
* * `w0`: Word 0
* @param {number} w0
* @returns {Instruction}
*/
  static createDeclareWord_1(w0: number): Instruction;
/**
* Creates a `dw`/`.word` asm directive
*
* # Arguments
*
* * `w0`: Word 0
* * `w1`: Word 1
* @param {number} w0
* @param {number} w1
* @returns {Instruction}
*/
  static createDeclareWord_2(w0: number, w1: number): Instruction;
/**
* Creates a `dw`/`.word` asm directive
*
* # Arguments
*
* * `w0`: Word 0
* * `w1`: Word 1
* * `w2`: Word 2
* @param {number} w0
* @param {number} w1
* @param {number} w2
* @returns {Instruction}
*/
  static createDeclareWord_3(w0: number, w1: number, w2: number): Instruction;
/**
* Creates a `dw`/`.word` asm directive
*
* # Arguments
*
* * `w0`: Word 0
* * `w1`: Word 1
* * `w2`: Word 2
* * `w3`: Word 3
* @param {number} w0
* @param {number} w1
* @param {number} w2
* @param {number} w3
* @returns {Instruction}
*/
  static createDeclareWord_4(w0: number, w1: number, w2: number, w3: number): Instruction;
/**
* Creates a `dw`/`.word` asm directive
*
* # Arguments
*
* * `w0`: Word 0
* * `w1`: Word 1
* * `w2`: Word 2
* * `w3`: Word 3
* * `w4`: Word 4
* @param {number} w0
* @param {number} w1
* @param {number} w2
* @param {number} w3
* @param {number} w4
* @returns {Instruction}
*/
  static createDeclareWord_5(w0: number, w1: number, w2: number, w3: number, w4: number): Instruction;
/**
* Creates a `dw`/`.word` asm directive
*
* # Arguments
*
* * `w0`: Word 0
* * `w1`: Word 1
* * `w2`: Word 2
* * `w3`: Word 3
* * `w4`: Word 4
* * `w5`: Word 5
* @param {number} w0
* @param {number} w1
* @param {number} w2
* @param {number} w3
* @param {number} w4
* @param {number} w5
* @returns {Instruction}
*/
  static createDeclareWord_6(w0: number, w1: number, w2: number, w3: number, w4: number, w5: number): Instruction;
/**
* Creates a `dw`/`.word` asm directive
*
* # Arguments
*
* * `w0`: Word 0
* * `w1`: Word 1
* * `w2`: Word 2
* * `w3`: Word 3
* * `w4`: Word 4
* * `w5`: Word 5
* * `w6`: Word 6
* @param {number} w0
* @param {number} w1
* @param {number} w2
* @param {number} w3
* @param {number} w4
* @param {number} w5
* @param {number} w6
* @returns {Instruction}
*/
  static createDeclareWord_7(w0: number, w1: number, w2: number, w3: number, w4: number, w5: number, w6: number): Instruction;
/**
* Creates a `dw`/`.word` asm directive
*
* # Arguments
*
* * `w0`: Word 0
* * `w1`: Word 1
* * `w2`: Word 2
* * `w3`: Word 3
* * `w4`: Word 4
* * `w5`: Word 5
* * `w6`: Word 6
* * `w7`: Word 7
* @param {number} w0
* @param {number} w1
* @param {number} w2
* @param {number} w3
* @param {number} w4
* @param {number} w5
* @param {number} w6
* @param {number} w7
* @returns {Instruction}
*/
  static createDeclareWord_8(w0: number, w1: number, w2: number, w3: number, w4: number, w5: number, w6: number, w7: number): Instruction;
/**
* Creates a `dw`/`.word` asm directive
*
* # Throws
*
* Throws if `data.length` is not 1-8
*
* # Arguments
*
* * `data`: Data
* @param {Uint16Array} data
* @returns {Instruction}
*/
  static createDeclareWord(data: Uint16Array): Instruction;
/**
* Creates a `dd`/`.int` asm directive
*
* # Arguments
*
* * `d0`: Dword 0
* @param {number} d0
* @returns {Instruction}
*/
  static createDeclareDword_1(d0: number): Instruction;
/**
* Creates a `dd`/`.int` asm directive
*
* # Arguments
*
* * `d0`: Dword 0
* * `d1`: Dword 1
* @param {number} d0
* @param {number} d1
* @returns {Instruction}
*/
  static createDeclareDword_2(d0: number, d1: number): Instruction;
/**
* Creates a `dd`/`.int` asm directive
*
* # Arguments
*
* * `d0`: Dword 0
* * `d1`: Dword 1
* * `d2`: Dword 2
* @param {number} d0
* @param {number} d1
* @param {number} d2
* @returns {Instruction}
*/
  static createDeclareDword_3(d0: number, d1: number, d2: number): Instruction;
/**
* Creates a `dd`/`.int` asm directive
*
* # Arguments
*
* * `d0`: Dword 0
* * `d1`: Dword 1
* * `d2`: Dword 2
* * `d3`: Dword 3
* @param {number} d0
* @param {number} d1
* @param {number} d2
* @param {number} d3
* @returns {Instruction}
*/
  static createDeclareDword_4(d0: number, d1: number, d2: number, d3: number): Instruction;
/**
* Creates a `dd`/`.int` asm directive
*
* # Throws
*
* Throws if `data.length` is not 1-4
*
* # Arguments
*
* * `data`: Data
* @param {Uint32Array} data
* @returns {Instruction}
*/
  static createDeclareDword(data: Uint32Array): Instruction;
/**
* Creates a `dq`/`.quad` asm directive
*
* # Arguments
*
* * `q0`: Qword 0
* @param {bigint} q0
* @returns {Instruction}
*/
  static createDeclareQword_1(q0: bigint): Instruction;
/**
* Creates a `dq`/`.quad` asm directive
*
* # Arguments
*
* * `q0`: Qword 0
* * `q1`: Qword 1
* @param {bigint} q0
* @param {bigint} q1
* @returns {Instruction}
*/
  static createDeclareQword_2(q0: bigint, q1: bigint): Instruction;
/**
* Creates a `dq`/`.quad` asm directive
*
* # Throws
*
* Throws if `data.length` is not 1-2
*
* # Arguments
*
* * `data`: Data
* @param {BigUint64Array} data
* @returns {Instruction}
*/
  static createDeclareQword(data: BigUint64Array): Instruction;
/**
* Gets the instruction code (a [`Code`] enum value), see also [`mnemonic`].
*
* [`mnemonic`]: #method.mnemonic
* [`Code`]: enum.Code.html
*/
  code: Code;
/**
* Gets the code size (a [`CodeSize`] enum value) when the instruction was decoded. This value is informational and can
* be used by a formatter.
*
* [`CodeSize`]: enum.CodeSize.html
*/
  codeSize: CodeSize;
/**
* Gets the condition code (a [`ConditionCode`] enum value) if it's `Jcc`, `SETcc`, `CMOVcc`, `CMPccXADD` else [`ConditionCode.None`] is returned
*
* [`ConditionCode`]: enum.ConditionCode.html
* [`ConditionCode.None`]: enum.ConditionCode.html#variant.None
*
* # Examples
*
* ```js
* const assert = require("assert").strict;
* const { ConditionCode, Decoder, DecoderOptions } = require("iced-x86");
*
* // setbe al
* // jl short label
* // cmovne ecx,esi
* // nop
* const bytes = new Uint8Array([0x0F, 0x96, 0xC0, 0x7C, 0x5A, 0x0F, 0x45, 0xCE, 0x90]);
* const decoder = new Decoder(64, bytes, DecoderOptions.None);
*
* // setbe al
* const instr = decoder.decode();
* assert.equal(instr.conditionCode, ConditionCode.be);
*
* // jl short label
* decoder.decodeOut(instr);
* assert.equal(instr.conditionCode, ConditionCode.l);
*
* // cmovne ecx,esi
* decoder.decodeOut(instr);
* assert.equal(instr.conditionCode, ConditionCode.ne);
*
* // nop
* decoder.decodeOut(instr);
* assert.equal(instr.conditionCode, ConditionCode.None);
*
* // Free wasm memory
* decoder.free();
* instr.free();
* ```
*/
  readonly conditionCode: ConditionCode;
/**
* Gets the number of elements in a `db`/`dw`/`dd`/`dq` directive.
* Can only be called if [`code`] is [`Code.DeclareByte`], [`Code.DeclareWord`], [`Code.DeclareDword`], [`Code.DeclareQword`]
*
* [`code`]: #method.code
* [`Code.DeclareByte`]: enum.Code.html#variant.DeclareByte
* [`Code.DeclareWord`]: enum.Code.html#variant.DeclareWord
* [`Code.DeclareDword`]: enum.Code.html#variant.DeclareDword
* [`Code.DeclareQword`]: enum.Code.html#variant.DeclareQword
*/
  declareDataLength: number;
/**
* Instruction encoding (a [`EncodingKind`] enum value), eg. Legacy, 3DNow!, VEX, EVEX, XOP
*
* [`EncodingKind`]: enum.EncodingKind.html
*
* # Examples
*
* ```js
* const assert = require("assert").strict;
* const { Decoder, DecoderOptions, EncodingKind } = require("iced-x86");
*
* // vmovaps xmm1,xmm5
* const bytes = new Uint8Array([0xC5, 0xF8, 0x28, 0xCD]);
* const decoder = new Decoder(64, bytes, DecoderOptions.None);
* const instr = decoder.decode();
*
* assert.equal(instr.encoding, EncodingKind.VEX);
*
* // Free wasm memory
* decoder.free();
* instr.free();
* ```
*/
  readonly encoding: EncodingKind;
/**
* Gets the operand's branch target. Use this method if the operand has kind [`OpKind.FarBranch16`]
*
* [`OpKind.FarBranch16`]: enum.OpKind.html#variant.FarBranch16
*/
  farBranch16: number;
/**
* Gets the operand's branch target. Use this method if the operand has kind [`OpKind.FarBranch32`]
*
* [`OpKind.FarBranch32`]: enum.OpKind.html#variant.FarBranch32
*/
  farBranch32: number;
/**
* Gets the operand's branch target selector. Use this method if the operand has kind [`OpKind.FarBranch16`] or [`OpKind.FarBranch32`]
*
* [`OpKind.FarBranch16`]: enum.OpKind.html#variant.FarBranch16
* [`OpKind.FarBranch32`]: enum.OpKind.html#variant.FarBranch32
*/
  farBranchSelector: number;
/**
* Control flow info (a [`FlowControl`] enum value)
*
* [`FlowControl`]: enum.FlowControl.html
*
* # Examples
*
* ```js
* const assert = require("assert").strict;
* const { Decoder, DecoderOptions, FlowControl } = require("iced-x86");
*
* // or ecx,esi
* // ud0 rcx,rsi
* // call rcx
* const bytes = new Uint8Array([0x0B, 0xCE, 0x48, 0x0F, 0xFF, 0xCE, 0xFF, 0xD1]);
* const decoder = new Decoder(64, bytes, DecoderOptions.None);
*
* // or ecx,esi
* const instr = decoder.decode();
* assert.equal(instr.flowControl, FlowControl.Next);
*
* // ud0 rcx,rsi
* decoder.decodeOut(instr);
* assert.equal(instr.flowControl, FlowControl.Exception);
*
* // call rcx
* decoder.decodeOut(instr);
* assert.equal(instr.flowControl, FlowControl.IndirectCall);
*
* // Free wasm memory
* decoder.free();
* instr.free();
* ```
*/
  readonly flowControl: FlowControl;
/**
* `true` if it's a conditional push/pop (eg. `FPTAN` or `FSINCOS`)
*/
  readonly fpuCondWritesTop: boolean;
/**
* Used if [`fpuWritesTop()`] is `true`:
*
* Value added to `TOP`.
*
* This is negative if it pushes one or more values and positive if it pops one or more values
* and `0` if it writes to `TOP` (eg. `FLDENV`, etc) without pushing/popping anything.
*
* [`fpuWritesTop()`]: #method.fpu_writes_top
*/
  readonly fpuTopIncrement: number;
/**
* `true` if `TOP` is written (it's a conditional/unconditional push/pop, `FNSAVE`, `FLDENV`, etc)
*/
  readonly fpuWritesTop: boolean;
/**
* `true` if the instruction has the `LOCK` prefix (`F0`)
*/
  hasLockPrefix: boolean;
/**
* Checks if there's an opmask register ([`opMask`])
*
* [`opMask`]: #method.op_mask
*/
  readonly hasOpMask: boolean;
/**
* `true` if the instruction has the `REPE` or `REP` prefix (`F3`)
*/
  hasRepPrefix: boolean;
/**
* `true` if the instruction has the `REPE` or `REP` prefix (`F3`)
*/
  hasRepePrefix: boolean;
/**
* `true` if the instruction has the `REPNE` prefix (`F2`)
*/
  hasRepnePrefix: boolean;
/**
* Checks if the instruction has a segment override prefix, see [`segmentPrefix`]
*
* [`segmentPrefix`]: #method.segment_prefix
*/
  readonly hasSegmentPrefix: boolean;
/**
* `true` if the instruction has the `XACQUIRE` prefix (`F2`)
*/
  hasXacquirePrefix: boolean;
/**
* `true` if the instruction has the `XRELEASE` prefix (`F3`)
*/
  hasXreleasePrefix: boolean;
/**
* Gets the operand's immediate value. Use this method if the operand has kind [`OpKind.Immediate16`]
*
* [`OpKind.Immediate16`]: enum.OpKind.html#variant.Immediate16
*/
  immediate16: number;
/**
* Gets the operand's immediate value. Use this method if the operand has kind [`OpKind.Immediate32`]
*
* [`OpKind.Immediate32`]: enum.OpKind.html#variant.Immediate32
*/
  immediate32: number;
/**
* Gets the operand's immediate value. Use this method if the operand has kind [`OpKind.Immediate32to64`]
*
* [`OpKind.Immediate32to64`]: enum.OpKind.html#variant.Immediate32to64
*/
  immediate32to64: bigint;
/**
* Gets the operand's immediate value. Use this method if the operand has kind [`OpKind.Immediate64`]
*
* [`OpKind.Immediate64`]: enum.OpKind.html#variant.Immediate64
*/
  immediate64: bigint;
/**
* Gets the operand's immediate value. Use this method if the operand has kind [`OpKind.Immediate8`]
*
* [`OpKind.Immediate8`]: enum.OpKind.html#variant.Immediate8
*/
  immediate8: number;
/**
* Gets the operand's immediate value. Use this method if the operand has kind [`OpKind.Immediate8_2nd`]
*
* [`OpKind.Immediate8_2nd`]: enum.OpKind.html#variant.Immediate8_2nd
*/
  immediate8_2nd: number;
/**
* Gets the operand's immediate value. Use this method if the operand has kind [`OpKind.Immediate8to16`]
*
* [`OpKind.Immediate8to16`]: enum.OpKind.html#variant.Immediate8to16
*/
  immediate8to16: number;
/**
* Gets the operand's immediate value. Use this method if the operand has kind [`OpKind.Immediate8to32`]
*
* [`OpKind.Immediate8to32`]: enum.OpKind.html#variant.Immediate8to32
*/
  immediate8to32: number;
/**
* Gets the operand's immediate value. Use this method if the operand has kind [`OpKind.Immediate8to64`]
*
* [`OpKind.Immediate8to64`]: enum.OpKind.html#variant.Immediate8to64
*/
  immediate8to64: bigint;
/**
* Gets the 64-bit IP of the instruction
*/
  ip: bigint;
/**
* Gets the 16-bit IP of the instruction
*/
  ip16: number;
/**
* Gets the 32-bit IP of the instruction
*/
  ip32: number;
/**
* Gets the `RIP`/`EIP` releative address ([`memoryDisplacement`]).
* This method is only valid if there's a memory operand with `RIP`/`EIP` relative addressing, see [`isIpRelMemoryOperand`]
*
* [`memoryDisplacement`]: #method.memory_displacement
* [`isIpRelMemoryOperand`]: #method.is_ip_rel_memory_operand
*/
  readonly ipRelMemoryAddress: bigint;
/**
* `true` if the data is broadcast (EVEX instructions only)
*/
  isBroadcast: boolean;
/**
* Checks if it's a `CALL FAR` instruction
*/
  readonly isCallFar: boolean;
/**
* Checks if it's a `CALL FAR [mem]` instruction
*/
  readonly isCallFarIndirect: boolean;
/**
* Checks if it's a `CALL NEAR` instruction
*/
  readonly isCallNear: boolean;
/**
* Checks if it's a `CALL NEAR reg/[mem]` instruction
*/
  readonly isCallNearIndirect: boolean;
/**
* Checks if it's an invalid instruction ([`code`] == [`Code.INVALID`])
*
* [`code`]: #method.code
* [`Code.INVALID`]: enum.Code.html#variant.INVALID
*/
  readonly isInvalid: boolean;
/**
* Checks if the memory operand is `RIP`/`EIP` relative
*/
  readonly isIpRelMemoryOperand: boolean;
/**
* Checks if it's a `Jcc NEAR` instruction
*/
  readonly isJccNear: boolean;
/**
* Checks if it's a `Jcc SHORT` instruction
*/
  readonly isJccShort: boolean;
/**
* Checks if it's a `Jcc SHORT` or `Jcc NEAR` instruction
*/
  readonly isJccShortOrNear: boolean;
/**
* Checks if it's a `JCXZ SHORT`, `JECXZ SHORT` or `JRCXZ SHORT` instruction
*/
  readonly isJcxShort: boolean;
/**
* Checks if it's a `JKccD NEAR` instruction
*/
  readonly isJkccNear: boolean;
/**
* Checks if it's a `JKccD SHORT` instruction
*/
  readonly isJkccShort: boolean;
/**
* Checks if it's a `JKccD SHORT` or `JKccD NEAR` instruction
*/
  readonly isJkccShortOrNear: boolean;
/**
* Checks if it's a `JMP FAR` instruction
*/
  readonly isJmpFar: boolean;
/**
* Checks if it's a `JMP FAR [mem]` instruction
*/
  readonly isJmpFarIndirect: boolean;
/**
* Checks if it's a `JMP NEAR` instruction
*/
  readonly isJmpNear: boolean;
/**
* Checks if it's a `JMP NEAR reg/[mem]` instruction
*/
  readonly isJmpNearIndirect: boolean;
/**
* Checks if it's a `JMP SHORT` instruction
*/
  readonly isJmpShort: boolean;
/**
* Checks if it's a `JMP SHORT` or a `JMP NEAR` instruction
*/
  readonly isJmpShortOrNear: boolean;
/**
* Checks if it's a `LOOP SHORT` instruction
*/
  readonly isLoop: boolean;
/**
* Checks if it's a `LOOPcc SHORT` instruction
*/
  readonly isLoopcc: boolean;
/**
* `true` if eviction hint bit is set (`{eh}`) (MVEX instructions only)
*/
  isMvexEvictionHint: boolean;
/**
* `true` if it's a privileged instruction (all CPL=0 instructions (except `VMCALL`) and IOPL instructions `IN`, `INS`, `OUT`, `OUTS`, `CLI`, `STI`)
*/
  readonly isPrivileged: boolean;
/**
* `true` if it's an instruction that saves or restores too many registers (eg. `FXRSTOR`, `XSAVE`, etc).
*/
  readonly isSaveRestoreInstruction: boolean;
/**
* `true` if this is an instruction that implicitly uses the stack pointer (`SP`/`ESP`/`RSP`), eg. `CALL`, `PUSH`, `POP`, `RET`, etc.
* See also [`stackPointerIncrement`]
*
* [`stackPointerIncrement`]: #method.stack_pointer_increment
*
* # Examples
*
* ```js
* const assert = require("assert").strict;
* const { Decoder, DecoderOptions } = require("iced-x86");
*
* // or ecx,esi
* // push rax
* const bytes = new Uint8Array([0x0B, 0xCE, 0x50]);
* const decoder = new Decoder(64, bytes, DecoderOptions.None);
*
* // or ecx,esi
* const instr = decoder.decode();
* assert.ok(!instr.isStackInstruction);
*
* // push rax
* decoder.decodeOut(instr);
* assert.ok(instr.isStackInstruction);
* assert.equal(instr.stackPointerIncrement, -8);
*
* // Free wasm memory
* decoder.free();
* instr.free();
* ```
*/
  readonly isStackInstruction: boolean;
/**
* `true` if it's a "string" instruction, such as `MOVS`, `LODS`, `SCAS`, etc.
*/
  readonly isStringInstruction: boolean;
/**
* Checks if this is a VSIB instruction, see also [`isVsib32`], [`isVsib64`]
*
* [`isVsib32`]: #method.is_vsib32
* [`isVsib64`]: #method.is_vsib64
*/
  readonly isVsib: boolean;
/**
* VSIB instructions only ([`isVsib`]): `true` if it's using 32-bit indexes, `false` if it's using 64-bit indexes
*
* [`isVsib`]: #method.is_vsib
*/
  readonly isVsib32: boolean;
/**
* VSIB instructions only ([`isVsib`]): `true` if it's using 64-bit indexes, `false` if it's using 32-bit indexes
*
* [`isVsib`]: #method.is_vsib
*/
  readonly isVsib64: boolean;
/**
* Gets the length of the instruction, 0-15 bytes. This is just informational. If you modify the instruction
* or create a new one, this method could return the wrong value.
*/
  length: number;
/**
* Gets the memory operand's base register (a [`Register`] enum value) or [`Register.None`] if none. Use this method if the operand has kind [`OpKind.Memory`]
*
* [`Register`]: enum.Register.html
* [`Register.None`]: enum.Register.html#variant.None
* [`OpKind.Memory`]: enum.OpKind.html#variant.Memory
*/
  memoryBase: Register;
/**
* Gets the size of the memory displacement in bytes. Valid values are `0`, `1` (16/32/64-bit), `2` (16-bit), `4` (32-bit), `8` (64-bit).
* Note that the return value can be 1 and [`memoryDisplacement`] may still not fit in
* a signed byte if it's an EVEX/MVEX encoded instruction.
* Use this method if the operand has kind [`OpKind.Memory`]
*
* [`memoryDisplacement`]: #method.memory_displacement
* [`OpKind.Memory`]: enum.OpKind.html#variant.Memory
*/
  memoryDisplSize: number;
/**
* Gets signed 64 bits of the memory operand's displacement or the 64-bit absolute address if it's
* an `EIP` or `RIP` relative memory operand.
* Use this method if the operand has kind [`OpKind.Memory`]
*
* [`OpKind.Memory`]: enum.OpKind.html#variant.Memory
*/
  memoryDisplacement: bigint;
/**
* Gets unsigned 64 bits of the memory operand's displacement or the 64-bit absolute address if it's
* an `EIP` or `RIP` relative memory operand.
* Use this method if the operand has kind [`OpKind.Memory`]
*
* [`OpKind.Memory`]: enum.OpKind.html#variant.Memory
*/
  memoryDisplacementU64: bigint;
/**
* Gets the memory operand's index register (a [`Register`] enum value) or [`Register.None`] if none. Use this method if the operand has kind [`OpKind.Memory`]
*
* [`Register`]: enum.Register.html
* [`Register.None`]: enum.Register.html#variant.None
* [`OpKind.Memory`]: enum.OpKind.html#variant.Memory
*/
  memoryIndex: Register;
/**
* Gets the index register scale value, valid values are `*1`, `*2`, `*4`, `*8`. Use this method if the operand has kind [`OpKind.Memory`]
*
* [`OpKind.Memory`]: enum.OpKind.html#variant.Memory
*/
  memoryIndexScale: number;
/**
* Gets the effective segment register (a [`Register`] enum value) used to reference the memory location.
* Use this method if the operand has kind [`OpKind.Memory`],
* [`OpKind.MemorySegSI`], [`OpKind.MemorySegESI`], [`OpKind.MemorySegRSI`]
*
* [`Register`]: enum.Register.html
* [`OpKind.Memory`]: enum.OpKind.html#variant.Memory
* [`OpKind.MemorySegSI`]: enum.OpKind.html#variant.MemorySegSI
* [`OpKind.MemorySegESI`]: enum.OpKind.html#variant.MemorySegESI
* [`OpKind.MemorySegRSI`]: enum.OpKind.html#variant.MemorySegRSI
*/
  readonly memorySegment: Register;
/**
* Gets the size of the memory location (a [`MemorySize`] enum value) that is referenced by the operand. See also [`isBroadcast`].
* Use this method if the operand has kind [`OpKind.Memory`],
* [`OpKind.MemorySegSI`], [`OpKind.MemorySegESI`], [`OpKind.MemorySegRSI`],
* [`OpKind.MemoryESDI`], [`OpKind.MemoryESEDI`], [`OpKind.MemoryESRDI`]
*
* [`MemorySize`]: enum.MemorySize.html
* [`isBroadcast`]: #method.is_broadcast
* [`OpKind.Memory`]: enum.OpKind.html#variant.Memory
* [`OpKind.MemorySegSI`]: enum.OpKind.html#variant.MemorySegSI
* [`OpKind.MemorySegESI`]: enum.OpKind.html#variant.MemorySegESI
* [`OpKind.MemorySegRSI`]: enum.OpKind.html#variant.MemorySegRSI
* [`OpKind.MemoryESDI`]: enum.OpKind.html#variant.MemoryESDI
* [`OpKind.MemoryESEDI`]: enum.OpKind.html#variant.MemoryESEDI
* [`OpKind.MemoryESRDI`]: enum.OpKind.html#variant.MemoryESRDI
*/
  readonly memorySize: MemorySize;
/**
* `true` if merging-masking, `false` if zeroing-masking.
* Only used by most EVEX encoded instructions that use opmask registers.
*/
  mergingMasking: boolean;
/**
* Gets the mnemonic (a [`Mnemonic`] enum value), see also [`code`]
*
* [`code`]: #method.code
* [`Mnemonic`]: enum.Mnemonic.html
*/
  readonly mnemonic: Mnemonic;
/**
* (MVEX) Register/memory operand conversion function
*/
  mvexRegMemConv: MvexRegMemConv;
/**
* Gets the operand's branch target. Use this method if the operand has kind [`OpKind.NearBranch16`]
*
* [`OpKind.NearBranch16`]: enum.OpKind.html#variant.NearBranch16
*/
  nearBranch16: number;
/**
* Gets the operand's branch target. Use this method if the operand has kind [`OpKind.NearBranch32`]
*
* [`OpKind.NearBranch32`]: enum.OpKind.html#variant.NearBranch32
*/
  nearBranch32: number;
/**
* Gets the operand's branch target. Use this method if the operand has kind [`OpKind.NearBranch64`]
*
* [`OpKind.NearBranch64`]: enum.OpKind.html#variant.NearBranch64
*/
  nearBranch64: bigint;
/**
* Gets the near branch target if it's a `CALL`/`JMP`/`Jcc` near branch instruction
* (i.e., if [`op0Kind`] is [`OpKind.NearBranch16`], [`OpKind.NearBranch32`] or [`OpKind.NearBranch64`])
*
* [`op0Kind`]: #method.op0_kind
* [`OpKind.NearBranch16`]: enum.OpKind.html#variant.NearBranch16
* [`OpKind.NearBranch32`]: enum.OpKind.html#variant.NearBranch32
* [`OpKind.NearBranch64`]: enum.OpKind.html#variant.NearBranch64
*/
  readonly nearBranchTarget: bigint;
/**
* Gets the 64-bit IP of the next instruction
*/
  nextIP: bigint;
/**
* Gets the 16-bit IP of the next instruction
*/
  nextIP16: number;
/**
* Gets the 32-bit IP of the next instruction
*/
  nextIP32: number;
/**
* Gets operand #0's kind (an [`OpKind`] enum value) if the operand exists (see [`opCount`] and [`opKind`])
*
* [`OpKind`]: enum.OpKind.html
* [`opCount`]: #method.op_count
* [`opKind`]: #method.op_kind
*/
  op0Kind: OpKind;
/**
* Gets operand #0's register value (a [`Register`] enum value). Use this method if operand #0 ([`op0Kind`]) has kind [`OpKind.Register`], see [`opCount`] and [`opRegister`]
*
* [`Register`]: enum.Register.html
* [`op0Kind`]: #method.op0_kind
* [`opCount`]: #method.op_count
* [`opRegister`]: #method.op_register
* [`Register.None`]: enum.Register.html#variant.None
* [`OpKind.Register`]: enum.OpKind.html#variant.Register
*/
  op0Register: Register;
/**
* Gets operand #1's kind (an [`OpKind`] enum value) if the operand exists (see [`opCount`] and [`opKind`])
*
* [`OpKind`]: enum.OpKind.html
* [`opCount`]: #method.op_count
* [`opKind`]: #method.op_kind
*/
  op1Kind: OpKind;
/**
* Gets operand #1's register value (a [`Register`] enum value). Use this method if operand #1 ([`op0Kind`]) has kind [`OpKind.Register`], see [`opCount`] and [`opRegister`]
*
* [`Register`]: enum.Register.html
* [`op0Kind`]: #method.op0_kind
* [`opCount`]: #method.op_count
* [`opRegister`]: #method.op_register
* [`Register.None`]: enum.Register.html#variant.None
* [`OpKind.Register`]: enum.OpKind.html#variant.Register
*/
  op1Register: Register;
/**
* Gets operand #2's kind (an [`OpKind`] enum value) if the operand exists (see [`opCount`] and [`opKind`])
*
* [`OpKind`]: enum.OpKind.html
* [`opCount`]: #method.op_count
* [`opKind`]: #method.op_kind
*/
  op2Kind: OpKind;
/**
* Gets operand #2's register value (a [`Register`] enum value). Use this method if operand #2 ([`op0Kind`]) has kind [`OpKind.Register`], see [`opCount`] and [`opRegister`]
*
* [`Register`]: enum.Register.html
* [`op0Kind`]: #method.op0_kind
* [`opCount`]: #method.op_count
* [`opRegister`]: #method.op_register
* [`Register.None`]: enum.Register.html#variant.None
* [`OpKind.Register`]: enum.OpKind.html#variant.Register
*/
  op2Register: Register;
/**
* Gets operand #3's kind (an [`OpKind`] enum value) if the operand exists (see [`opCount`] and [`opKind`])
*
* [`OpKind`]: enum.OpKind.html
* [`opCount`]: #method.op_count
* [`opKind`]: #method.op_kind
*/
  op3Kind: OpKind;
/**
* Gets operand #3's register value (a [`Register`] enum value). Use this method if operand #3 ([`op0Kind`]) has kind [`OpKind.Register`], see [`opCount`] and [`opRegister`]
*
* [`Register`]: enum.Register.html
* [`op0Kind`]: #method.op0_kind
* [`opCount`]: #method.op_count
* [`opRegister`]: #method.op_register
* [`Register.None`]: enum.Register.html#variant.None
* [`OpKind.Register`]: enum.OpKind.html#variant.Register
*/
  op3Register: Register;
/**
* Gets operand #4's kind (an [`OpKind`] enum value) if the operand exists (see [`opCount`] and [`opKind`])
*
* [`OpKind`]: enum.OpKind.html
* [`opCount`]: #method.op_count
* [`opKind`]: #method.op_kind
*/
  op4Kind: OpKind;
/**
* Gets operand #4's register value (a [`Register`] enum value). Use this method if operand #4 ([`op0Kind`]) has kind [`OpKind.Register`], see [`opCount`] and [`opRegister`]
*
* [`Register`]: enum.Register.html
* [`op0Kind`]: #method.op0_kind
* [`opCount`]: #method.op_count
* [`opRegister`]: #method.op_register
* [`Register.None`]: enum.Register.html#variant.None
* [`OpKind.Register`]: enum.OpKind.html#variant.Register
*/
  op4Register: Register;
/**
* Gets the [`OpCodeInfo`]
*
* [`OpCodeInfo`]: struct.OpCodeInfo.html
*/
  readonly opCode: OpCodeInfo;
/**
* Gets the operand count. An instruction can have 0-5 operands.
*
* # Examples
*
* ```js
* const assert = require("assert").strict;
* const { Decoder, DecoderOptions } = require("iced-x86");
*
* // add [rax],ebx
* const bytes = new Uint8Array([0x01, 0x18]);
* const decoder = new Decoder(64, bytes, DecoderOptions.None);
* const instr = decoder.decode();
*
* assert.equal(instr.opCount, 2);
*
* // Free wasm memory
* decoder.free();
* instr.free();
* ```
*/
  readonly opCount: number;
/**
* Gets the opmask register ([`Register.K1`] - [`Register.K7`]) or [`Register.None`] if none
*
* [`Register.K1`]: enum.Register.html#variant.K1
* [`Register.K7`]: enum.Register.html#variant.K7
* [`Register.None`]: enum.Register.html#variant.None
*/
  opMask: Register;
/**
* All flags that are always cleared by the CPU.
* This method returns a [`RflagsBits`] value. See also [`rflagsModified`].
*
* [`RflagsBits`]: enum.RflagsBits.html
* [`rflagsModified`]: #method.rflags_modified
*
* # Examples
*
* ```js
* const assert = require("assert").strict;
* const { Decoder, DecoderOptions, RflagsBits } = require("iced-x86");
*
* // adc rsi,rcx
* // xor rdi,5Ah
* const bytes = new Uint8Array([0x48, 0x11, 0xCE, 0x48, 0x83, 0xF7, 0x5A]);
* const decoder = new Decoder(64, bytes, DecoderOptions.None);
*
* // adc rsi,rcx
* const instr = decoder.decode();
* assert.equal(instr.rflagsRead, RflagsBits.CF);
* assert.equal(instr.rflagsWritten, RflagsBits.OF | RflagsBits.SF | RflagsBits.ZF | RflagsBits.AF | RflagsBits.CF | RflagsBits.PF);
* assert.equal(instr.rflagsCleared, RflagsBits.None);
* assert.equal(instr.rflagsSet, RflagsBits.None);
* assert.equal(instr.rflagsUndefined, RflagsBits.None);
* assert.equal(instr.rflagsModified, RflagsBits.OF | RflagsBits.SF | RflagsBits.ZF | RflagsBits.AF | RflagsBits.CF | RflagsBits.PF);
*
* // xor rdi,5Ah
* decoder.decodeOut(instr);
* assert.equal(instr.rflagsRead, RflagsBits.None);
* assert.equal(instr.rflagsWritten, RflagsBits.SF | RflagsBits.ZF | RflagsBits.PF);
* assert.equal(instr.rflagsCleared, RflagsBits.OF | RflagsBits.CF);
* assert.equal(instr.rflagsSet, RflagsBits.None);
* assert.equal(instr.rflagsUndefined, RflagsBits.AF);
* assert.equal(instr.rflagsModified, RflagsBits.OF | RflagsBits.SF | RflagsBits.ZF | RflagsBits.AF | RflagsBits.CF | RflagsBits.PF);
*
* // Free wasm memory
* decoder.free();
* instr.free();
* ```
*/
  readonly rflagsCleared: number;
/**
* All flags that are modified by the CPU. This is `rflagsWritten + rflagsCleared + rflagsSet + rflagsUndefined`.
* This method returns a [`RflagsBits`] value.
*
* [`RflagsBits`]: enum.RflagsBits.html
*
* # Examples
*
* ```js
* const assert = require("assert").strict;
* const { Decoder, DecoderOptions, RflagsBits } = require("iced-x86");
*
* // adc rsi,rcx
* // xor rdi,5Ah
* const bytes = new Uint8Array([0x48, 0x11, 0xCE, 0x48, 0x83, 0xF7, 0x5A]);
* const decoder = new Decoder(64, bytes, DecoderOptions.None);
*
* // adc rsi,rcx
* const instr = decoder.decode();
* assert.equal(instr.rflagsRead, RflagsBits.CF);
* assert.equal(instr.rflagsWritten, RflagsBits.OF | RflagsBits.SF | RflagsBits.ZF | RflagsBits.AF | RflagsBits.CF | RflagsBits.PF);
* assert.equal(instr.rflagsCleared, RflagsBits.None);
* assert.equal(instr.rflagsSet, RflagsBits.None);
* assert.equal(instr.rflagsUndefined, RflagsBits.None);
* assert.equal(instr.rflagsModified, RflagsBits.OF | RflagsBits.SF | RflagsBits.ZF | RflagsBits.AF | RflagsBits.CF | RflagsBits.PF);
*
* // xor rdi,5Ah
* decoder.decodeOut(instr);
* assert.equal(instr.rflagsRead, RflagsBits.None);
* assert.equal(instr.rflagsWritten, RflagsBits.SF | RflagsBits.ZF | RflagsBits.PF);
* assert.equal(instr.rflagsCleared, RflagsBits.OF | RflagsBits.CF);
* assert.equal(instr.rflagsSet, RflagsBits.None);
* assert.equal(instr.rflagsUndefined, RflagsBits.AF);
* assert.equal(instr.rflagsModified, RflagsBits.OF | RflagsBits.SF | RflagsBits.ZF | RflagsBits.AF | RflagsBits.CF | RflagsBits.PF);
*
* // Free wasm memory
* decoder.free();
* instr.free();
* ```
*/
  readonly rflagsModified: number;
/**
* All flags that are read by the CPU when executing the instruction.
* This method returns a [`RflagsBits`] value. See also [`rflagsModified`].
*
* [`RflagsBits`]: enum.RflagsBits.html
* [`rflagsModified`]: #method.rflags_modified
*
* # Examples
*
* ```js
* const assert = require("assert").strict;
* const { Decoder, DecoderOptions, RflagsBits } = require("iced-x86");
*
* // adc rsi,rcx
* // xor rdi,5Ah
* const bytes = new Uint8Array([0x48, 0x11, 0xCE, 0x48, 0x83, 0xF7, 0x5A]);
* const decoder = new Decoder(64, bytes, DecoderOptions.None);
*
* // adc rsi,rcx
* const instr = decoder.decode();
* assert.equal(instr.rflagsRead, RflagsBits.CF);
* assert.equal(instr.rflagsWritten, RflagsBits.OF | RflagsBits.SF | RflagsBits.ZF | RflagsBits.AF | RflagsBits.CF | RflagsBits.PF);
* assert.equal(instr.rflagsCleared, RflagsBits.None);
* assert.equal(instr.rflagsSet, RflagsBits.None);
* assert.equal(instr.rflagsUndefined, RflagsBits.None);
* assert.equal(instr.rflagsModified, RflagsBits.OF | RflagsBits.SF | RflagsBits.ZF | RflagsBits.AF | RflagsBits.CF | RflagsBits.PF);
*
* // xor rdi,5Ah
* decoder.decodeOut(instr);
* assert.equal(instr.rflagsRead, RflagsBits.None);
* assert.equal(instr.rflagsWritten, RflagsBits.SF | RflagsBits.ZF | RflagsBits.PF);
* assert.equal(instr.rflagsCleared, RflagsBits.OF | RflagsBits.CF);
* assert.equal(instr.rflagsSet, RflagsBits.None);
* assert.equal(instr.rflagsUndefined, RflagsBits.AF);
* assert.equal(instr.rflagsModified, RflagsBits.OF | RflagsBits.SF | RflagsBits.ZF | RflagsBits.AF | RflagsBits.CF | RflagsBits.PF);
*
* // Free wasm memory
* decoder.free();
* instr.free();
* ```
*/
  readonly rflagsRead: number;
/**
* All flags that are always set by the CPU.
* This method returns a [`RflagsBits`] value. See also [`rflagsModified`].
*
* [`RflagsBits`]: enum.RflagsBits.html
* [`rflagsModified`]: #method.rflags_modified
*
* # Examples
*
* ```js
* const assert = require("assert").strict;
* const { Decoder, DecoderOptions, RflagsBits } = require("iced-x86");
*
* // adc rsi,rcx
* // xor rdi,5Ah
* const bytes = new Uint8Array([0x48, 0x11, 0xCE, 0x48, 0x83, 0xF7, 0x5A]);
* const decoder = new Decoder(64, bytes, DecoderOptions.None);
*
* // adc rsi,rcx
* const instr = decoder.decode();
* assert.equal(instr.rflagsRead, RflagsBits.CF);
* assert.equal(instr.rflagsWritten, RflagsBits.OF | RflagsBits.SF | RflagsBits.ZF | RflagsBits.AF | RflagsBits.CF | RflagsBits.PF);
* assert.equal(instr.rflagsCleared, RflagsBits.None);
* assert.equal(instr.rflagsSet, RflagsBits.None);
* assert.equal(instr.rflagsUndefined, RflagsBits.None);
* assert.equal(instr.rflagsModified, RflagsBits.OF | RflagsBits.SF | RflagsBits.ZF | RflagsBits.AF | RflagsBits.CF | RflagsBits.PF);
*
* // xor rdi,5Ah
* decoder.decodeOut(instr);
* assert.equal(instr.rflagsRead, RflagsBits.None);
* assert.equal(instr.rflagsWritten, RflagsBits.SF | RflagsBits.ZF | RflagsBits.PF);
* assert.equal(instr.rflagsCleared, RflagsBits.OF | RflagsBits.CF);
* assert.equal(instr.rflagsSet, RflagsBits.None);
* assert.equal(instr.rflagsUndefined, RflagsBits.AF);
* assert.equal(instr.rflagsModified, RflagsBits.OF | RflagsBits.SF | RflagsBits.ZF | RflagsBits.AF | RflagsBits.CF | RflagsBits.PF);
*
* // Free wasm memory
* decoder.free();
* instr.free();
* ```
*/
  readonly rflagsSet: number;
/**
* All flags that are undefined after executing the instruction.
* This method returns a [`RflagsBits`] value. See also [`rflagsModified`].
*
* [`RflagsBits`]: enum.RflagsBits.html
* [`rflagsModified`]: #method.rflags_modified
*
* # Examples
*
* ```js
* const assert = require("assert").strict;
* const { Decoder, DecoderOptions, RflagsBits } = require("iced-x86");
*
* // adc rsi,rcx
* // xor rdi,5Ah
* const bytes = new Uint8Array([0x48, 0x11, 0xCE, 0x48, 0x83, 0xF7, 0x5A]);
* const decoder = new Decoder(64, bytes, DecoderOptions.None);
*
* // adc rsi,rcx
* const instr = decoder.decode();
* assert.equal(instr.rflagsRead, RflagsBits.CF);
* assert.equal(instr.rflagsWritten, RflagsBits.OF | RflagsBits.SF | RflagsBits.ZF | RflagsBits.AF | RflagsBits.CF | RflagsBits.PF);
* assert.equal(instr.rflagsCleared, RflagsBits.None);
* assert.equal(instr.rflagsSet, RflagsBits.None);
* assert.equal(instr.rflagsUndefined, RflagsBits.None);
* assert.equal(instr.rflagsModified, RflagsBits.OF | RflagsBits.SF | RflagsBits.ZF | RflagsBits.AF | RflagsBits.CF | RflagsBits.PF);
*
* // xor rdi,5Ah
* decoder.decodeOut(instr);
* assert.equal(instr.rflagsRead, RflagsBits.None);
* assert.equal(instr.rflagsWritten, RflagsBits.SF | RflagsBits.ZF | RflagsBits.PF);
* assert.equal(instr.rflagsCleared, RflagsBits.OF | RflagsBits.CF);
* assert.equal(instr.rflagsSet, RflagsBits.None);
* assert.equal(instr.rflagsUndefined, RflagsBits.AF);
* assert.equal(instr.rflagsModified, RflagsBits.OF | RflagsBits.SF | RflagsBits.ZF | RflagsBits.AF | RflagsBits.CF | RflagsBits.PF);
*
* // Free wasm memory
* decoder.free();
* instr.free();
* ```
*/
  readonly rflagsUndefined: number;
/**
* All flags that are written by the CPU, except those flags that are known to be undefined, always set or always cleared.
* This method returns a [`RflagsBits`] value. See also [`rflagsModified`].
*
* [`RflagsBits`]: enum.RflagsBits.html
* [`rflagsModified`]: #method.rflags_modified
*
* # Examples
*
* ```js
* const assert = require("assert").strict;
* const { Decoder, DecoderOptions, RflagsBits } = require("iced-x86");
*
* // adc rsi,rcx
* // xor rdi,5Ah
* const bytes = new Uint8Array([0x48, 0x11, 0xCE, 0x48, 0x83, 0xF7, 0x5A]);
* const decoder = new Decoder(64, bytes, DecoderOptions.None);
*
* // adc rsi,rcx
* const instr = decoder.decode();
* assert.equal(instr.rflagsRead, RflagsBits.CF);
* assert.equal(instr.rflagsWritten, RflagsBits.OF | RflagsBits.SF | RflagsBits.ZF | RflagsBits.AF | RflagsBits.CF | RflagsBits.PF);
* assert.equal(instr.rflagsCleared, RflagsBits.None);
* assert.equal(instr.rflagsSet, RflagsBits.None);
* assert.equal(instr.rflagsUndefined, RflagsBits.None);
* assert.equal(instr.rflagsModified, RflagsBits.OF | RflagsBits.SF | RflagsBits.ZF | RflagsBits.AF | RflagsBits.CF | RflagsBits.PF);
*
* // xor rdi,5Ah
* decoder.decodeOut(instr);
* assert.equal(instr.rflagsRead, RflagsBits.None);
* assert.equal(instr.rflagsWritten, RflagsBits.SF | RflagsBits.ZF | RflagsBits.PF);
* assert.equal(instr.rflagsCleared, RflagsBits.OF | RflagsBits.CF);
* assert.equal(instr.rflagsSet, RflagsBits.None);
* assert.equal(instr.rflagsUndefined, RflagsBits.AF);
* assert.equal(instr.rflagsModified, RflagsBits.OF | RflagsBits.SF | RflagsBits.ZF | RflagsBits.AF | RflagsBits.CF | RflagsBits.PF);
*
* // Free wasm memory
* decoder.free();
* instr.free();
* ```
*/
  readonly rflagsWritten: number;
/**
* Gets the rounding control (a [`RoundingControl`] enum value) (SAE is implied but [`suppressAllExceptions`] still returns `false`)
* or [`RoundingControl.None`] if the instruction doesn't use it.
*
* [`RoundingControl`]: enum.RoundingControl.html
* [`suppressAllExceptions`]: #method.suppress_all_exceptions
* [`RoundingControl.None`]: enum.RoundingControl.html#variant.None
*/
  roundingControl: RoundingControl;
/**
* Gets the segment override prefix (a [`Register`] enum value) or [`Register.None`] if none. See also [`memorySegment`].
* Use this method if the operand has kind [`OpKind.Memory`],
* [`OpKind.MemorySegSI`], [`OpKind.MemorySegESI`], [`OpKind.MemorySegRSI`]
*
* [`Register`]: enum.Register.html
* [`Register.None`]: enum.Register.html#variant.None
* [`memorySegment`]: #method.memory_segment
* [`OpKind.Memory`]: enum.OpKind.html#variant.Memory
* [`OpKind.MemorySegSI`]: enum.OpKind.html#variant.MemorySegSI
* [`OpKind.MemorySegESI`]: enum.OpKind.html#variant.MemorySegESI
* [`OpKind.MemorySegESI`]: enum.OpKind.html#variant.MemorySegESI
* [`OpKind.MemorySegRSI`]: enum.OpKind.html#variant.MemorySegRSI
*/
  segmentPrefix: Register;
/**
* Gets the number of bytes added to `SP`/`ESP`/`RSP` or 0 if it's not an instruction that pushes or pops data. This method assumes
* the instruction doesn't change the privilege level (eg. `IRET/D/Q`). If it's the `LEAVE` instruction, this method returns 0.
*
* # Examples
*
* ```js
* const assert = require("assert").strict;
* const { Decoder, DecoderOptions } = require("iced-x86");
*
* // pushfq
* const bytes = new Uint8Array([0x9C]);
* const decoder = new Decoder(64, bytes, DecoderOptions.None);
* const instr = decoder.decode();
*
* assert.ok(instr.isStackInstruction);
* assert.equal(instr.stackPointerIncrement, -8);
*
* // Free wasm memory
* decoder.free();
* instr.free();
* ```
*/
  readonly stackPointerIncrement: number;
/**
* Gets the suppress all exceptions flag (EVEX/MVEX encoded instructions). Note that if [`roundingControl`] is
* not [`RoundingControl.None`], SAE is implied but this method will still return `false`.
*
* [`roundingControl`]: #method.rounding_control
* [`RoundingControl.None`]: enum.RoundingControl.html#variant.None
*/
  suppressAllExceptions: boolean;
/**
* Checks if it's a vsib instruction.
*
* # Returns
*
* * `true` if it's a VSIB instruction with 64-bit indexes
* * `false` if it's a VSIB instruction with 32-bit indexes
* * `undefined` if it's not a VSIB instruction.
*/
  readonly vsib: boolean | undefined;
/**
* `true` if zeroing-masking, `false` if merging-masking.
* Only used by most EVEX encoded instructions that use opmask registers.
*/
  zeroingMasking: boolean;
}
/**
* Contains accessed registers and memory locations
* Created by an [`InstructionInfoFactory`].
*
* [`InstructionInfoFactory`]: struct.InstructionInfoFactory.html
*/
export class InstructionInfo {
  free(): void;
/**
* Gets all accessed registers (an array of [`UsedRegister`] classes).
* This method doesn't return all accessed registers if [`isSaveRestoreInstruction`] is `true`.
*
* Some instructions have a `r16`/`r32` operand but only use the low 8 bits of the register. In that case
* this method returns the 8-bit register even if it's `SPL`, `BPL`, `SIL`, `DIL` and the
* instruction was decoded in 16 or 32-bit mode. This is more accurate than returning the `r16`/`r32`
* register. Example instructions that do this: `PINSRB`, `ARPL`
*
* [`UsedRegister`]: struct.UsedRegister.html
* [`isSaveRestoreInstruction`]: #method.is_save_restore_instruction
* @returns {Array<any>}
*/
  usedRegisters(): Array<any>;
/**
* Gets all accessed memory locations (an array of [`UsedMemory`] classes).
*
* [`UsedMemory`]: struct.UsedMemory.html
* @returns {Array<any>}
*/
  usedMemory(): Array<any>;
/**
* Gets operand access (an [`OpAccess`] enum value)
*
* [`OpAccess`]: enum.OpAccess.html
*
* # Throws
*
* Throws if `operand` is invalid
*
* # Arguments
*
* * `operand`: Operand number, 0-4
* @param {number} operand
* @returns {OpAccess}
*/
  opAccess(operand: number): OpAccess;
/**
* Operand #0 access (an [`OpAccess`] enum value)
*
* [`OpAccess`]: enum.OpAccess.html
*/
  readonly op0Access: OpAccess;
/**
* Operand #1 access (an [`OpAccess`] enum value)
*
* [`OpAccess`]: enum.OpAccess.html
*/
  readonly op1Access: OpAccess;
/**
* Operand #2 access (an [`OpAccess`] enum value)
*
* [`OpAccess`]: enum.OpAccess.html
*/
  readonly op2Access: OpAccess;
/**
* Operand #3 access (an [`OpAccess`] enum value)
*
* [`OpAccess`]: enum.OpAccess.html
*/
  readonly op3Access: OpAccess;
/**
* Operand #4 access (an [`OpAccess`] enum value)
*
* [`OpAccess`]: enum.OpAccess.html
*/
  readonly op4Access: OpAccess;
}
/**
* Creates [`InstructionInfo`]s.
*
* [`InstructionInfo`]: struct.InstructionInfo.html
*/
export class InstructionInfoFactory {
  free(): void;
/**
* Creates a new instance.
*
* # Examples
*
* ```js
* const assert = require("assert").strict;
* const { Decoder, DecoderOptions, Instruction, InstructionInfoFactory } = require("iced-x86");
*
* // add [rdi+r12*8-5AA5EDCCh],esi
* const bytes = new Uint8Array([0x42, 0x01, 0xB4, 0xE7, 0x34, 0x12, 0x5A, 0xA5]);
* const decoder = new Decoder(64, bytes, DecoderOptions.None);
*
* const infoFactory = new InstructionInfoFactory();
* const instr = new Instruction();
* while (decoder.canDecode) {
*     // Decode the next instruction, overwriting `instr`
*     decoder.decodeOut(instr);
*
*     // There's also infoOptions() if you only need reg usage or only mem usage.
*     // info() returns both.
*     const info = infoFactory.info(instr);
*     for (const memInfo of info.usedMemory()) {
*         // Do something here with the `UsedMemory` instance...
*         // ...
*
*         // Free wasm memory
*         memInfo.free();
*     }
*     for (const regInfo of info.usedRegisters()) {
*         // Do something here with the `UsedRegister` instance...
*         // ...
*
*         // Free wasm memory
*         regInfo.free();
*     }
* }
*
* // Free wasm memory
* decoder.free();
* instr.free();
* infoFactory.free();
* ```
*/
  constructor();
/**
* Creates a new [`InstructionInfo`], see also [`infoOptions()`] if you only need register usage
* but not memory usage or vice versa.
*
* [`InstructionInfo`]: struct.InstructionInfo.html
* [`infoOptions()`]: #method.info_options
*
* # Arguments
*
* * `instruction`: The instruction that should be analyzed
*
* # Examples
*
* ```js
* const assert = require("assert").strict;
* const { Decoder, DecoderOptions, InstructionInfoFactory, MemorySize, OpAccess, Register } = require("iced-x86");
*
* // add [rdi+r12*8-5AA5EDCCh],esi
* const bytes = new Uint8Array([0x42, 0x01, 0xB4, 0xE7, 0x34, 0x12, 0x5A, 0xA5]);
* const decoder = new Decoder(64, bytes, DecoderOptions.None);
* const infoFactory = new InstructionInfoFactory();
*
* const instr = decoder.decode();
* const info = infoFactory.info(instr);
*
* const usedMem = info.usedMemory();
* assert.equal(usedMem.length, 1);
* const mem = usedMem[0];
* assert.equal(mem.segment, Register.DS);
* assert.equal(mem.base, Register.RDI);
* assert.equal(mem.index, Register.R12);
* assert.equal(mem.scale, 8);
* assert.equal(mem.displacement, 0xFFFFFFFFA55A1234n);
* assert.equal(mem.memorySize, MemorySize.UInt32);
* assert.equal(mem.access, OpAccess.ReadWrite);
*
* const usedRegs = info.usedRegisters();
* assert.equal(usedRegs.length, 3);
* assert.equal(usedRegs[0].register, Register.RDI);
* assert.equal(usedRegs[0].access, OpAccess.Read);
* assert.equal(usedRegs[1].register, Register.R12);
* assert.equal(usedRegs[1].access, OpAccess.Read);
* assert.equal(usedRegs[2].register, Register.ESI);
* assert.equal(usedRegs[2].access, OpAccess.Read);
*
* // Free wasm memory
* decoder.free();
* instr.free();
* infoFactory.free();
* usedMem.forEach(m => m.free());
* usedRegs.forEach(r => r.free());
* ```
* @param {Instruction} instruction
* @returns {InstructionInfo}
*/
  info(instruction: Instruction): InstructionInfo;
/**
* Creates a new [`InstructionInfo`], see also [`info()`].
*
* [`InstructionInfo`]: struct.InstructionInfo.html
* [`info()`]: #method.info
*
* # Arguments
*
* * `instruction`: The instruction that should be analyzed
* * `options`: Options, see [`InstructionInfoOptions`]
*
* [`InstructionInfoOptions`]: struct.InstructionInfoOptions.html
* @param {Instruction} instruction
* @param {number} options
* @returns {InstructionInfo}
*/
  infoOptions(instruction: Instruction, options: number): InstructionInfo;
}
/**
* Memory operand passed to one of [`Instruction`]'s `create*()` constructor methods
*
* [`Instruction`]: struct.Instruction.html
*/
export class MemoryOperand {
  free(): void;
/**
* Constructor
*
* # Arguments
*
* * `base`: Base register or [`Register.None`] (a [`Register`] value)
* * `index`: Index register or [`Register.None`] (a [`Register`] value)
* * `scale`: Index register scale (1, 2, 4, or 8)
* * `displacement`: Memory displacement
* * `displSize`: 0 (no displ), 1 (16/32/64-bit, but use 2/4/8 if it doesn't fit in a `i8`), 2 (16-bit), 4 (32-bit) or 8 (64-bit)
* * `isBroadcast`: `true` if it's broadcast memory (EVEX instructions)
* * `segmentPrefix`: Segment override or [`Register.None`] (a [`Register`] value)
*
* [`Register`]: enum.Register.html
* [`Register.None`]: enum.Register.html#variant.None
* @param {Register} base
* @param {Register} index
* @param {number} scale
* @param {bigint} displacement
* @param {number} displSize
* @param {boolean} isBroadcast
* @param {Register} segmentPrefix
*/
  constructor(base: Register, index: Register, scale: number, displacement: bigint, displSize: number, isBroadcast: boolean, segmentPrefix: Register);
/**
* Constructor
*
* # Arguments
*
* * `base`: Base register or [`Register.None`] (a [`Register`] value)
* * `index`: Index register or [`Register.None`] (a [`Register`] value)
* * `scale`: Index register scale (1, 2, 4, or 8)
* * `displacement`: Memory displacement
* * `displSize`: 0 (no displ), 1 (16/32/64-bit, but use 2/4/8 if it doesn't fit in a `i8`), 2 (16-bit), 4 (32-bit) or 8 (64-bit)
* * `isBroadcast`: `true` if it's broadcast memory (EVEX instructions)
* * `segmentPrefix`: Segment override or [`Register.None`] (a [`Register`] value)
*
* [`Register`]: enum.Register.html
* [`Register.None`]: enum.Register.html#variant.None
* @param {Register} base
* @param {Register} index
* @param {number} scale
* @param {bigint} displacement
* @param {number} displSize
* @param {boolean} isBroadcast
* @param {Register} segmentPrefix
* @returns {MemoryOperand}
*/
  static new64(base: Register, index: Register, scale: number, displacement: bigint, displSize: number, isBroadcast: boolean, segmentPrefix: Register): MemoryOperand;
/**
* Constructor
*
* # Arguments
*
* * `base`: Base register or [`Register.None`] (a [`Register`] value)
* * `index`: Index register or [`Register.None`] (a [`Register`] value)
* * `scale`: Index register scale (1, 2, 4, or 8)
* * `isBroadcast`: `true` if it's broadcast memory (EVEX instructions)
* * `segmentPrefix`: Segment override or [`Register.None`] (a [`Register`] value)
*
* [`Register`]: enum.Register.html
* [`Register.None`]: enum.Register.html#variant.None
* @param {Register} base
* @param {Register} index
* @param {number} scale
* @param {boolean} isBroadcast
* @param {Register} segmentPrefix
* @returns {MemoryOperand}
*/
  static createBaseIndexScaleBcstSeg(base: Register, index: Register, scale: number, isBroadcast: boolean, segmentPrefix: Register): MemoryOperand;
/**
* Constructor
*
* # Arguments
*
* * `base`: Base register or [`Register.None`] (a [`Register`] value)
* * `displacement`: Memory displacement
* * `displSize`: 0 (no displ), 1 (16/32/64-bit, but use 2/4/8 if it doesn't fit in a `i8`), 2 (16-bit), 4 (32-bit) or 8 (64-bit)
* * `isBroadcast`: `true` if it's broadcast memory (EVEX instructions)
* * `segmentPrefix`: Segment override or [`Register.None`] (a [`Register`] value)
*
* [`Register`]: enum.Register.html
* [`Register.None`]: enum.Register.html#variant.None
* @param {Register} base
* @param {bigint} displacement
* @param {number} displSize
* @param {boolean} isBroadcast
* @param {Register} segmentPrefix
* @returns {MemoryOperand}
*/
  static createBaseDisplSizeBcstSeg(base: Register, displacement: bigint, displSize: number, isBroadcast: boolean, segmentPrefix: Register): MemoryOperand;
/**
* Constructor
*
* # Arguments
*
* * `index`: Index register or [`Register.None`] (a [`Register`] value)
* * `scale`: Index register scale (1, 2, 4, or 8)
* * `displacement`: Memory displacement
* * `displSize`: 0 (no displ), 1 (16/32/64-bit, but use 2/4/8 if it doesn't fit in a `i8`), 2 (16-bit), 4 (32-bit) or 8 (64-bit)
* * `isBroadcast`: `true` if it's broadcast memory (EVEX instructions)
* * `segmentPrefix`: Segment override or [`Register.None`] (a [`Register`] value)
*
* [`Register`]: enum.Register.html
* [`Register.None`]: enum.Register.html#variant.None
* @param {Register} index
* @param {number} scale
* @param {bigint} displacement
* @param {number} displSize
* @param {boolean} isBroadcast
* @param {Register} segmentPrefix
* @returns {MemoryOperand}
*/
  static createIndexScaleDisplSizeBcstSeg(index: Register, scale: number, displacement: bigint, displSize: number, isBroadcast: boolean, segmentPrefix: Register): MemoryOperand;
/**
* Constructor
*
* # Arguments
*
* * `base`: Base register or [`Register.None`] (a [`Register`] value)
* * `displacement`: Memory displacement
* * `isBroadcast`: `true` if it's broadcast memory (EVEX instructions)
* * `segmentPrefix`: Segment override or [`Register.None`] (a [`Register`] value)
*
* [`Register`]: enum.Register.html
* [`Register.None`]: enum.Register.html#variant.None
* @param {Register} base
* @param {bigint} displacement
* @param {boolean} isBroadcast
* @param {Register} segmentPrefix
* @returns {MemoryOperand}
*/
  static createBaseDisplBcstSeg(base: Register, displacement: bigint, isBroadcast: boolean, segmentPrefix: Register): MemoryOperand;
/**
* Constructor
*
* # Arguments
*
* * `base`: Base register or [`Register.None`] (a [`Register`] value)
* * `index`: Index register or [`Register.None`] (a [`Register`] value)
* * `scale`: Index register scale (1, 2, 4, or 8)
* * `displacement`: Memory displacement
* * `displSize`: 0 (no displ), 1 (16/32/64-bit, but use 2/4/8 if it doesn't fit in a `i8`), 2 (16-bit), 4 (32-bit) or 8 (64-bit)
*
* [`Register`]: enum.Register.html
* [`Register.None`]: enum.Register.html#variant.None
* @param {Register} base
* @param {Register} index
* @param {number} scale
* @param {bigint} displacement
* @param {number} displSize
* @returns {MemoryOperand}
*/
  static createBaseIndexScaleDisplSize(base: Register, index: Register, scale: number, displacement: bigint, displSize: number): MemoryOperand;
/**
* Constructor
*
* # Arguments
*
* * `base`: Base register or [`Register.None`] (a [`Register`] value)
* * `index`: Index register or [`Register.None`] (a [`Register`] value)
* * `scale`: Index register scale (1, 2, 4, or 8)
*
* [`Register`]: enum.Register.html
* [`Register.None`]: enum.Register.html#variant.None
* @param {Register} base
* @param {Register} index
* @param {number} scale
* @returns {MemoryOperand}
*/
  static createBaseIndexScale(base: Register, index: Register, scale: number): MemoryOperand;
/**
* Constructor
*
* # Arguments
*
* * `base`: Base register or [`Register.None`] (a [`Register`] value)
* * `index`: Index register or [`Register.None`] (a [`Register`] value)
*
* [`Register`]: enum.Register.html
* [`Register.None`]: enum.Register.html#variant.None
* @param {Register} base
* @param {Register} index
* @returns {MemoryOperand}
*/
  static createBaseIndex(base: Register, index: Register): MemoryOperand;
/**
* Constructor
*
* # Arguments
*
* * `base`: Base register or [`Register.None`] (a [`Register`] value)
* * `displacement`: Memory displacement
* * `displSize`: 0 (no displ), 1 (16/32/64-bit, but use 2/4/8 if it doesn't fit in a `i8`), 2 (16-bit), 4 (32-bit) or 8 (64-bit)
*
* [`Register`]: enum.Register.html
* [`Register.None`]: enum.Register.html#variant.None
* @param {Register} base
* @param {bigint} displacement
* @param {number} displSize
* @returns {MemoryOperand}
*/
  static createBaseDisplSize(base: Register, displacement: bigint, displSize: number): MemoryOperand;
/**
* Constructor
*
* # Arguments
*
* * `index`: Index register or [`Register.None`] (a [`Register`] value)
* * `scale`: Index register scale (1, 2, 4, or 8)
* * `displacement`: Memory displacement
* * `displSize`: 0 (no displ), 1 (16/32/64-bit, but use 2/4/8 if it doesn't fit in a `i8`), 2 (16-bit), 4 (32-bit) or 8 (64-bit)
*
* [`Register`]: enum.Register.html
* [`Register.None`]: enum.Register.html#variant.None
* @param {Register} index
* @param {number} scale
* @param {bigint} displacement
* @param {number} displSize
* @returns {MemoryOperand}
*/
  static createIndexScaleDisplSize(index: Register, scale: number, displacement: bigint, displSize: number): MemoryOperand;
/**
* Constructor
*
* # Arguments
*
* * `base`: Base register or [`Register.None`] (a [`Register`] value)
* * `displacement`: Memory displacement
*
* [`Register`]: enum.Register.html
* [`Register.None`]: enum.Register.html#variant.None
* @param {Register} base
* @param {bigint} displacement
* @returns {MemoryOperand}
*/
  static createBaseDispl(base: Register, displacement: bigint): MemoryOperand;
/**
* Constructor
*
* # Arguments
*
* * `base`: Base register or [`Register.None`] (a [`Register`] value)
*
* [`Register`]: enum.Register.html
* [`Register.None`]: enum.Register.html#variant.None
* @param {Register} base
* @returns {MemoryOperand}
*/
  static createBase(base: Register): MemoryOperand;
}
/**
* [`MemorySize`] enum extension methods
*
* [`MemorySize`]: enum.MemorySize.html
*/
export class MemorySizeExt {
  free(): void;
/**
* Gets the size in bytes of the memory location or 0 if it's not accessed by the instruction or unknown or variable sized
*
* # Arguments
*
* - `value`: A [`MemorySize`] enum value
*
* [`MemorySize`]: enum.MemorySize.html
*
* # Examples
*
* ```js
* const assert = require("assert").strict;
* const { MemorySize, MemorySizeExt } = require("iced-x86");
*
* assert.equal(MemorySizeExt.size(MemorySize.UInt32), 4);
* assert.equal(MemorySizeExt.size(MemorySize.Packed256_UInt16), 32);
* assert.equal(MemorySizeExt.size(MemorySize.Broadcast512_UInt64), 8);
* ```
* @param {MemorySize} value
* @returns {number}
*/
  static size(value: MemorySize): number;
/**
* Gets the size in bytes of the packed element. If it's not a packed data type, it's equal to [`MemorySizeExt.size()`].
*
* # Arguments
*
* - `value`: A [`MemorySize`] enum value
*
* [`MemorySize`]: enum.MemorySize.html
* [`MemorySizeExt.size()`]: #method.size
*
* # Examples
*
* ```js
* const assert = require("assert").strict;
* const { MemorySize, MemorySizeExt } = require("iced-x86");
*
* assert.equal(MemorySizeExt.elementSize(MemorySize.UInt32), 4);
* assert.equal(MemorySizeExt.elementSize(MemorySize.Packed256_UInt16), 2);
* assert.equal(MemorySizeExt.elementSize(MemorySize.Broadcast512_UInt64), 8);
* ```
* @param {MemorySize} value
* @returns {number}
*/
  static elementSize(value: MemorySize): number;
/**
* Gets the element type if it's packed data or `value` if it's not packed data
*
* # Arguments
*
* - `value`: A [`MemorySize`] enum value
*
* [`MemorySize`]: enum.MemorySize.html
*
* # Examples
*
* ```js
* const assert = require("assert").strict;
* const { MemorySize, MemorySizeExt } = require("iced-x86");
*
* assert.equal(MemorySizeExt.elementType(MemorySize.UInt32), MemorySize.UInt32);
* assert.equal(MemorySizeExt.elementType(MemorySize.Packed256_UInt16), MemorySize.UInt16);
* assert.equal(MemorySizeExt.elementType(MemorySize.Broadcast512_UInt64), MemorySize.UInt64);
* ```
* @param {MemorySize} value
* @returns {MemorySize}
*/
  static elementType(value: MemorySize): MemorySize;
/**
* `true` if it's signed data (signed integer or a floating point value)
*
* # Arguments
*
* - `value`: A [`MemorySize`] enum value
*
* [`MemorySize`]: enum.MemorySize.html
*
* # Examples
*
* ```js
* const assert = require("assert").strict;
* const { MemorySize, MemorySizeExt } = require("iced-x86");
*
* assert.ok(!MemorySizeExt.isSigned(MemorySize.UInt32));
* assert.ok(MemorySizeExt.isSigned(MemorySize.Int32));
* assert.ok(MemorySizeExt.isSigned(MemorySize.Float64));
* ```
* @param {MemorySize} value
* @returns {boolean}
*/
  static isSigned(value: MemorySize): boolean;
/**
* `true` if this is a packed data type, eg. [`MemorySize.Packed128_Float32`]
*
* # Arguments
*
* - `value`: A [`MemorySize`] enum value
*
* [`MemorySize`]: enum.MemorySize.html
* [`MemorySize.Packed128_Float32`]: #variant.Packed128_Float32
*
* # Examples
*
* ```js
* const assert = require("assert").strict;
* const { MemorySize, MemorySizeExt } = require("iced-x86");
*
* assert.ok(!MemorySizeExt.isPacked(MemorySize.UInt32));
* assert.ok(MemorySizeExt.isPacked(MemorySize.Packed256_UInt16));
* assert.ok(!MemorySizeExt.isPacked(MemorySize.Broadcast512_UInt64));
* ```
* @param {MemorySize} value
* @returns {boolean}
*/
  static isPacked(value: MemorySize): boolean;
/**
* Gets the number of elements in the packed data type or `1` if it's not packed data ([`MemorySizeExt.isPacked()`])
*
* # Arguments
*
* - `value`: A [`MemorySize`] enum value
*
* [`MemorySize`]: enum.MemorySize.html
* [`MemorySizeExt.isPacked()`]: #method.is_packed
*
* # Examples
*
* ```js
* const assert = require("assert").strict;
* const { MemorySize, MemorySizeExt } = require("iced-x86");
*
* assert.equal(MemorySizeExt.elementCount(MemorySize.UInt32), 1);
* assert.equal(MemorySizeExt.elementCount(MemorySize.Packed256_UInt16), 16);
* assert.equal(MemorySizeExt.elementCount(MemorySize.Broadcast512_UInt64), 1);
* ```
* @param {MemorySize} value
* @returns {number}
*/
  static elementCount(value: MemorySize): number;
/**
* Checks if it is a broadcast memory type
*
* # Arguments
*
* - `value`: A [`MemorySize`] enum value
*
* [`MemorySize`]: enum.MemorySize.html
*
* # Examples
*
* ```js
* const assert = require("assert").strict;
* const { MemorySize, MemorySizeExt } = require("iced-x86");
*
* assert.ok(!MemorySizeExt.isBroadcast(MemorySize.Packed64_Float16));
* assert.ok(MemorySizeExt.isBroadcast(MemorySize.Broadcast512_UInt64));
* ```
* @param {MemorySize} value
* @returns {boolean}
*/
  static isBroadcast(value: MemorySize): boolean;
}
/**
* Opcode info, returned by [`Instruction.opCode`]
*
* [`Instruction.opCode`]: struct.Instruction.html#method.op_code
*/
export class OpCodeInfo {
  free(): void;
/**
* Gets an operand's opkind (a [`OpCodeOperandKind`] enum value)
*
* [`OpCodeOperandKind`]: enum.OpCodeOperandKind.html
*
* # Throws
*
* Throws if `operand` is invalid
*
* # Arguments
*
* * `operand`: Operand number, 0-4
* @param {number} operand
* @returns {OpCodeOperandKind}
*/
  opKind(operand: number): OpCodeOperandKind;
/**
* Checks if the instruction is available in 16-bit mode, 32-bit mode or 64-bit mode
*
* # Throws
*
* Throws if `bitness` is not one of 16, 32, 64.
*
* # Arguments
*
* * `bitness`: 16, 32 or 64
* @param {number} bitness
* @returns {boolean}
*/
  isAvailableInMode(bitness: number): boolean;
/**
* (VEX/XOP/EVEX) `L` / `L'L` value or default value if [`isLIG`] is `true`
*
* [`isLIG`]: #method.is_lig
*/
  readonly L: number;
/**
* (VEX/XOP/EVEX/MVEX) `W` value or default value if [`isWIG`] or [`isWIG32`] is `true`
*
* [`isWIG`]: #method.is_wig
* [`isWIG32`]: #method.is_wig32
*/
  readonly W: number;
/**
* (Legacy encoding) Gets the required address size (16,32,64) or 0
*/
  readonly addressSize: number;
/**
* `true` if it's decoded by iced's 16-bit AMD decoder
*/
  readonly amdDecoder16: boolean;
/**
* `true` if it's decoded by iced's 32-bit AMD decoder
*/
  readonly amdDecoder32: boolean;
/**
* `true` if it's decoded by iced's 64-bit AMD decoder
*/
  readonly amdDecoder64: boolean;
/**
* `true` if the `LOCK` prefix can be used as an extra register bit (bit 3) to access registers 8-15 without a `REX` prefix (eg. in 32-bit mode)
*/
  readonly amdLockRegBit: boolean;
/**
* (AMD SVM) `true` if it may cause a #VMEXIT in guest mode
*/
  readonly amdMayVmExit: boolean;
/**
* (AMD SVM) `true` if it causes a #VMEXIT in guest mode
*/
  readonly amdVmExit: boolean;
/**
* If it has a memory operand, gets the [`MemorySize`] (broadcast memory type)
*
* Returns a [`MemorySize`] enum value
*
* [`MemorySize`]: enum.MemorySize.html
*/
  readonly broadcastMemorySize: MemorySize;
/**
* (EVEX) `true` if the instruction supports broadcasting (`EVEX.b` bit) (if it has a memory operand)
*/
  readonly canBroadcast: boolean;
/**
* (EVEX/MVEX) `true` if the instruction supports suppress all exceptions
*/
  readonly canSuppressAllExceptions: boolean;
/**
* `true` if the `BND` (`F2`) prefix can be used
*/
  readonly canUseBndPrefix: boolean;
/**
* `true` if the `HINT-TAKEN` (`3E`) and `HINT-NOT-TAKEN` (`2E`) prefixes can be used
*/
  readonly canUseHintTakenPrefix: boolean;
/**
* `true` if the `LOCK` (`F0`) prefix can be used
*/
  readonly canUseLockPrefix: boolean;
/**
* `true` if the `NOTRACK` (`3E`) prefix can be used
*/
  readonly canUseNotrackPrefix: boolean;
/**
* (EVEX/MVEX) `true` if an opmask register can be used
*/
  readonly canUseOpMaskRegister: boolean;
/**
* `true` if the `REP` / `REPE` (`F3`) prefixes can be used
*/
  readonly canUseRepPrefix: boolean;
/**
* `true` if the `REPNE` (`F2`) prefix can be used
*/
  readonly canUseRepnePrefix: boolean;
/**
* (EVEX/MVEX) `true` if the instruction supports rounding control
*/
  readonly canUseRoundingControl: boolean;
/**
* `true` if the `XACQUIRE` (`F2`) prefix can be used
*/
  readonly canUseXacquirePrefix: boolean;
/**
* `true` if the `XRELEASE` (`F3`) prefix can be used
*/
  readonly canUseXreleasePrefix: boolean;
/**
* (EVEX) `true` if the instruction supports zeroing masking (if one of the opmask registers `K1`-`K7` is used and destination operand is not a memory operand)
*/
  readonly canUseZeroingMasking: boolean;
/**
* Gets the code (a [`Code`] enum value)
*
* [`Code`]: enum.Code.html
*
* # Examples
*
* ```js
* const assert = require("assert").strict;
* const { Code, CodeExt } = require("iced-x86");
*
* const opCode = CodeExt.opCode(Code.EVEX_Vmovapd_ymm_k1z_ymmm256);
* assert.equal(opCode.code, Code.EVEX_Vmovapd_ymm_k1z_ymmm256);
*
* // Free wasm memory
* opCode.free();
* ```
*/
  readonly code: Code;
/**
* `true` if it can be executed in compatibility mode
*/
  readonly compatibilityMode: boolean;
/**
* `true` if it can be executed when CPL=0
*/
  readonly cpl0: boolean;
/**
* `true` if it can be executed when CPL=1
*/
  readonly cpl1: boolean;
/**
* `true` if it can be executed when CPL=2
*/
  readonly cpl2: boolean;
/**
* `true` if it can be executed when CPL=3
*/
  readonly cpl3: boolean;
/**
* Gets the decoder option that's needed to decode the instruction or [`DecoderOptions::None`].
* The return value is a [`DecoderOptions`] value.
*
* [`DecoderOptions::None`]: struct.DecoderOptions.html#associatedconstant.NONE
* [`DecoderOptions`]: struct.DecoderOptions.html
*/
  readonly decoderOption: number;
/**
* `true` if the default operand size is 64 in 64-bit mode. A `66` prefix can switch to 16-bit operand size.
*/
  readonly defaultOpSize64: boolean;
/**
* Gets the encoding (a [`EncodingKind`] enum value)
*
* [`EncodingKind`]: enum.EncodingKind.html
*
* # Examples
*
* ```js
* const assert = require("assert").strict;
* const { Code, CodeExt, EncodingKind } = require("iced-x86");
*
* const opCode = CodeExt.opCode(Code.EVEX_Vmovapd_ymm_k1z_ymmm256);
* assert.equal(opCode.encoding, EncodingKind.EVEX);
*
* // Free wasm memory
* opCode.free();
* ```
*/
  readonly encoding: EncodingKind;
/**
* `true` if the operand size is always 64 in 64-bit mode. A `66` prefix is ignored.
*/
  readonly forceOpSize64: boolean;
/**
* `true` if an `FWAIT` (`9B`) instruction is added before the instruction
*/
  readonly fwait: boolean;
/**
* Group index (0-7) or -1. If it's 0-7, it's stored in the `reg` field of the `modrm` byte.
*/
  readonly groupIndex: number;
/**
* `true` if the mod bits are ignored and it's assumed `modrm[7:6] == 11b`
*/
  readonly ignoresModBits: boolean;
/**
* `true` if rounding control is ignored (#UD is not generated)
*/
  readonly ignoresRoundingControl: boolean;
/**
* `true` if the instruction doesn't read the segment register if it uses a memory operand
*/
  readonly ignoresSegment: boolean;
/**
* Gets the instruction string, eg. `VPBROADCASTB xmm1, xmm2/m8`, see also [`opCodeString`]
*
* [`opCodeString`]: #method.op_code_string
*
* # Examples
*
* ```js
* const assert = require("assert").strict;
* const { Code, CodeExt } = require("iced-x86");
*
* const opCode = CodeExt.opCode(Code.EVEX_Vmovapd_ymm_k1z_ymmm256);
* assert.equal("VMOVAPD ymm1 {k1}{z}, ymm2/m256", opCode.instructionString);
*
* // Free wasm memory
* opCode.free();
* ```
*/
  readonly instructionString: string;
/**
* `true` if it's decoded by iced's 16-bit Intel decoder
*/
  readonly intelDecoder16: boolean;
/**
* `true` if it's decoded by iced's 32-bit Intel decoder
*/
  readonly intelDecoder32: boolean;
/**
* `true` if it's decoded by iced's 64-bit Intel decoder
*/
  readonly intelDecoder64: boolean;
/**
* `true` if the Intel decoder forces 64-bit operand size. A `66` prefix is ignored.
*/
  readonly intelForceOpSize64: boolean;
/**
* (Intel VMX) `true` if it may cause a VM exit in VMX non-root operation
*/
  readonly intelMayVmExit: boolean;
/**
* (Intel VMX) `true` if it causes an SMM VM exit in VMX root operation (if dual-monitor treatment is activated)
*/
  readonly intelSmmVmExit: boolean;
/**
* (Intel VMX) `true` if it causes a VM exit in VMX non-root operation
*/
  readonly intelVmExit: boolean;
/**
* `true` if it's a tracked `JMP`/`CALL` indirect instruction (CET)
*/
  readonly isCetTracked: boolean;
/**
* `true` if it's a no-wait FPU instruction, eg. `FNINIT`
*/
  readonly isFpuNoWait: boolean;
/**
* `true` if it's part of a group
*/
  readonly isGroup: boolean;
/**
* `true` if the instruction accesses the I/O address space (eg. `IN`, `OUT`, `INS`, `OUTS`)
*/
  readonly isInputOutput: boolean;
/**
* `true` if it's an instruction, `false` if it's eg. [`Code.INVALID`], [`db`], [`dw`], [`dd`], [`dq`], [`zero_bytes`]
*
* # Examples
*
* ```js
* const assert = require("assert").strict;
* const { Code, CodeExt } = require("iced-x86");
*
* const opCode1 = CodeExt.opCode(Code.EVEX_Vmovapd_ymm_k1z_ymmm256);
* assert.ok(opCode1.isInstruction);
* const opCode2 = CodeExt.opCode(Code.INVALID);
* assert.ok(!opCode2.isInstruction);
* const opCode3 = CodeExt.opCode(Code.DeclareByte);
* assert.ok(!opCode3.isInstruction);
*
* // Free wasm memory
* opCode1.free();
* opCode2.free();
* opCode3.free();
* ```
*
* [`Code.INVALID`]: enum.Code.html#variant.INVALID
* [`db`]: enum.Code.html#variant.DeclareByte
* [`dw`]: enum.Code.html#variant.DeclareWord
* [`dd`]: enum.Code.html#variant.DeclareDword
* [`dq`]: enum.Code.html#variant.DeclareQword
* [`zero_bytes`]: enum.Code.html#variant.Zero_bytes
*/
  readonly isInstruction: boolean;
/**
* (VEX/XOP/EVEX) `true` if the `L` / `L'L` fields are ignored.
*
* EVEX: if reg-only ops and `{er}` (`EVEX.b` is set), `L'L` is the rounding control and not ignored.
*/
  readonly isLIG: boolean;
/**
* `true` if it's a non-temporal hint memory access (eg. `MOVNTDQ`)
*/
  readonly isNonTemporal: boolean;
/**
* `true` if it's one of the many nop instructions (does not include FPU nop instructions, eg. `FNOP`)
*/
  readonly isNop: boolean;
/**
* `true` if the opmask register is read and written (instead of just read). This also implies that it can't be `K0`.
*/
  readonly isOpMaskReadWrite: boolean;
/**
* `true` if it's a privileged instruction (all CPL=0 instructions (except `VMCALL`) and IOPL instructions `IN`, `INS`, `OUT`, `OUTS`, `CLI`, `STI`)
*/
  readonly isPrivileged: boolean;
/**
* `true` if it's one of the many reserved nop instructions (eg. `0F0D`, `0F18-0F1F`)
*/
  readonly isReservedNop: boolean;
/**
* `true` if it's part of a modrm.rm group
*/
  readonly isRmGroup: boolean;
/**
* `true` if it reads/writes too many registers
*/
  readonly isSaveRestore: boolean;
/**
* `true` if it's a serializing instruction (AMD CPUs)
*/
  readonly isSerializingAmd: boolean;
/**
* `true` if it's a serializing instruction (Intel CPUs)
*/
  readonly isSerializingIntel: boolean;
/**
* `true` if it's an instruction that implicitly uses the stack register, eg. `CALL`, `POP`, etc
*/
  readonly isStackInstruction: boolean;
/**
* (VEX/XOP/EVEX/MVEX) `true` if the `W` field is ignored in 16/32/64-bit modes
*/
  readonly isWIG: boolean;
/**
* (VEX/XOP/EVEX/MVEX) `true` if the `W` field is ignored in 16/32-bit modes (but not 64-bit mode)
*/
  readonly isWIG32: boolean;
/**
* `true` if it can be executed in 64-bit mode
*/
  readonly longMode: boolean;
/**
* Gets the mandatory prefix (a [`MandatoryPrefix`] enum value)
*
* [`MandatoryPrefix`]: enum.MandatoryPrefix.html
*/
  readonly mandatoryPrefix: MandatoryPrefix;
/**
* `true` if the instruction requires either CPL=0 or CPL<=3 depending on some CPU option (eg. `CR4.TSD`, `CR4.PCE`, `CR4.UMIP`)
*/
  readonly mayRequireCpl0: boolean;
/**
* If it has a memory operand, gets the [`MemorySize`] (non-broadcast memory type)
*
* Returns a [`MemorySize`] enum value
*
* [`MemorySize`]: enum.MemorySize.html
*/
  readonly memorySize: MemorySize;
/**
* Gets the mnemonic (a [`Mnemonic`] enum value)
*
* [`Mnemonic`]: enum.Mnemonic.html
*
* # Examples
*
* ```js
* const assert = require("assert").strict;
* const { Code, CodeExt, Mnemonic } = require("iced-x86");
*
* const opCode = CodeExt.opCode(Code.EVEX_Vmovapd_ymm_k1z_ymmm256);
* assert.equal(opCode.mnemonic, Mnemonic.Vmovapd);
*
* // Free wasm memory
* opCode.free();
* ```
*/
  readonly mnemonic: Mnemonic;
/**
* `true` if it's an instruction available in 16-bit mode
*/
  readonly mode16: boolean;
/**
* `true` if it's an instruction available in 32-bit mode
*/
  readonly mode32: boolean;
/**
* `true` if it's an instruction available in 64-bit mode
*/
  readonly mode64: boolean;
/**
* `true` if it can only be executed when CPL=0
*/
  readonly mustBeCpl0: boolean;
/**
* (MVEX) `true` if the instruction supports eviction hint (if it has a memory operand)
*/
  readonly mvexCanUseEvictionHint: boolean;
/**
* (MVEX) `true` if the instruction's rounding control bits are stored in `imm8[1:0]`
*/
  readonly mvexCanUseImmRoundingControl: boolean;
/**
* (MVEX) Gets the conversion function, eg. `Sf32` (a [`MvexConvFn`] enum value)
*
* [`MvexConvFn`]: enum.MvexConvFn.html
*/
  readonly mvexConversionFunc: MvexConvFn;
/**
* (MVEX) Gets the `EH` bit that's required to encode this instruction (a [`MvexEHBit`] enum value)
*
* [`MvexEHBit`]: enum.MvexEHBit.html
*/
  readonly mvexEHBit: MvexEHBit;
/**
* (MVEX) `true` if the instruction ignores op mask registers (eg. `{k1}`)
*/
  readonly mvexIgnoresOpMaskRegister: boolean;
/**
* (MVEX) `true` if the instruction must have `MVEX.SSS=000` if `MVEX.EH=1`
*/
  readonly mvexNoSaeRc: boolean;
/**
* (MVEX) Gets the tuple type / conv lut kind Gets the base tuple type (conv fn = `000b`) (a [`MvexTupleTypeLutKind`] enum value)
*
* [`MvexTupleTypeLutKind`]: enum.MvexTupleTypeLutKind.html
*/
  readonly mvexTupleTypeLutKind: MvexTupleTypeLutKind;
/**
* (MVEX) Gets flags indicating which conversion functions are valid (bit 0 == func 0)
*/
  readonly mvexValidConversionFuncsMask: number;
/**
* (MVEX) Gets flags indicating which swizzle functions are valid (bit 0 == func 0)
*/
  readonly mvexValidSwizzleFuncsMask: number;
/**
* `true` if the `F2`/`F3` prefixes aren't allowed
*/
  readonly nfx: boolean;
/**
* `true` if the `66` prefix is not allowed (it will #UD)
*/
  readonly no66: boolean;
/**
* Gets operand #0's opkind (a [`OpCodeOperandKind`] enum value)
*
* [`OpCodeOperandKind`]: enum.OpCodeOperandKind.html
*/
  readonly op0Kind: OpCodeOperandKind;
/**
* Gets operand #1's opkind (a [`OpCodeOperandKind`] enum value)
*
* [`OpCodeOperandKind`]: enum.OpCodeOperandKind.html
*/
  readonly op1Kind: OpCodeOperandKind;
/**
* Gets operand #2's opkind (a [`OpCodeOperandKind`] enum value)
*
* [`OpCodeOperandKind`]: enum.OpCodeOperandKind.html
*/
  readonly op2Kind: OpCodeOperandKind;
/**
* Gets operand #3's opkind (a [`OpCodeOperandKind`] enum value)
*
* [`OpCodeOperandKind`]: enum.OpCodeOperandKind.html
*/
  readonly op3Kind: OpCodeOperandKind;
/**
* Gets operand #4's opkind (a [`OpCodeOperandKind`] enum value)
*
* [`OpCodeOperandKind`]: enum.OpCodeOperandKind.html
*/
  readonly op4Kind: OpCodeOperandKind;
/**
* Gets the opcode byte(s). The low byte(s) of this value is the opcode. The length is in [`opCodeLength`].
* It doesn't include the table value, see [`table`].
*
* # Examples
*
* ```js
* const assert = require("assert").strict;
* const { Code, CodeExt } = require("iced-x86");
*
* const opCode1 = CodeExt.opCode(Code.Ffreep_sti);
* assert.equal(opCode1.opCode, 0xDFC0);
* const opCode2 = CodeExt.opCode(Code.Vmrunw);
* assert.equal(opCode2.opCode, 0x01D8);
* const opCode3 = CodeExt.opCode(Code.Sub_r8_rm8);
* assert.equal(opCode3.opCode, 0x2A);
* const opCode4 = CodeExt.opCode(Code.Cvtpi2ps_xmm_mmm64);
* assert.equal(opCode4.opCode, 0x2A);
*
* // Free wasm memory
* opCode1.free();
* opCode2.free();
* opCode3.free();
* opCode4.free();
* ```
*
* [`opCodeLength`]: #method.op_code_len
* [`table`]: #method.table
*/
  readonly opCode: number;
/**
* Gets the length of the opcode bytes ([`opCode`]). The low bytes is the opcode value.
*
* # Examples
*
* ```js
* const assert = require("assert").strict;
* const { Code, CodeExt } = require("iced-x86");
*
* const opCode1 = CodeExt.opCode(Code.Ffreep_sti);
* assert.equal(opCode1.opCodeLength, 2);
* const opCode2 = CodeExt.opCode(Code.Vmrunw);
* assert.equal(opCode2.opCodeLength, 2);
* const opCode3 = CodeExt.opCode(Code.Sub_r8_rm8);
* assert.equal(opCode3.opCodeLength, 1);
* const opCode4 = CodeExt.opCode(Code.Cvtpi2ps_xmm_mmm64);
* assert.equal(opCode4.opCodeLength, 1);
*
* // Free wasm memory
* opCode1.free();
* opCode2.free();
* opCode3.free();
* opCode4.free();
* ```
*
* [`opCode`]: #method.op_code
*/
  readonly opCodeLength: number;
/**
* Gets the opcode string, eg. `VEX.128.66.0F38.W0 78 /r`, see also [`instructionString`]
*
* [`instructionString`]: #method.instruction_string
*
* # Examples
*
* ```js
* const assert = require("assert").strict;
* const { Code, CodeExt } = require("iced-x86");
*
* const opCode = CodeExt.opCode(Code.EVEX_Vmovapd_ymm_k1z_ymmm256);
* assert.equal(opCode.opCodeString, "EVEX.256.66.0F.W1 28 /r");
*
* // Free wasm memory
* opCode.free();
* ```
*/
  readonly opCodeString: string;
/**
* Gets the number of operands
*/
  readonly opCount: number;
/**
* (Legacy encoding) Gets the required operand size (16,32,64) or 0
*/
  readonly operandSize: number;
/**
* `true` if it can be executed in protected mode
*/
  readonly protectedMode: boolean;
/**
* `true` if it can be executed in real mode
*/
  readonly realMode: boolean;
/**
* (EVEX/MVEX) `true` if a non-zero opmask register must be used
*/
  readonly requireOpMaskRegister: boolean;
/**
* `true` if the destination register's reg-num must not be present in any other operand, eg.
* `MNEMONIC XMM1,YMM1,[RAX+ZMM1*2]` is invalid. Registers = `XMM`/`YMM`/`ZMM`/`TMM`.
*/
  readonly requiresUniqueDestRegNum: boolean;
/**
* `true` if the index reg's reg-num (vsib op) (if any) and register ops' reg-nums must be unique,
* eg. `MNEMONIC XMM1,YMM1,[RAX+ZMM1*2]` is invalid. Registers = `XMM`/`YMM`/`ZMM`/`TMM`.
*/
  readonly requiresUniqueRegNums: boolean;
/**
* Group index (0-7) or -1. If it's 0-7, it's stored in the `rm` field of the `modrm` byte.
*/
  readonly rmGroupIndex: number;
/**
* Gets the opcode table (a [`OpCodeTableKind`] enum value)
*
* [`OpCodeTableKind`]: enum.OpCodeTableKind.html
*/
  readonly table: OpCodeTableKind;
/**
* `true` if #UD is generated in TDX non-root operation
*/
  readonly tdxNonRootGenUd: boolean;
/**
* `true` if #VE is generated in TDX non-root operation
*/
  readonly tdxNonRootGenVe: boolean;
/**
* `true` if an exception (eg. #GP(0), #VE) may be generated in TDX non-root operation
*/
  readonly tdxNonRootMayGenEx: boolean;
/**
* `true` if it causes a TSX abort inside a TSX transaction
*/
  readonly tsxAbort: boolean;
/**
* `true` if it causes a TSX abort inside a TSX transaction depending on the implementation
*/
  readonly tsxImplAbort: boolean;
/**
* `true` if it may cause a TSX abort inside a TSX transaction depending on some condition
*/
  readonly tsxMayAbort: boolean;
/**
* (EVEX/MVEX) Gets the tuple type (a [`TupleType`] enum value)
*
* [`TupleType`]: enum.TupleType.html
*/
  readonly tupleType: TupleType;
/**
* `true` if it can be used inside an enclave (SGX1)
*/
  readonly useInEnclaveSgx1: boolean;
/**
* `true` if it can be used inside an enclave (SGX2)
*/
  readonly useInEnclaveSgx2: boolean;
/**
* `true` if it can be used in SEAM
*/
  readonly useInSeam: boolean;
/**
* `true` if it can be used in SMM
*/
  readonly useInSmm: boolean;
/**
* `true` if it can be used in VMX non-root operation
*/
  readonly useInVmxNonRootOp: boolean;
/**
* `true` if it can be used in VMX root operation
*/
  readonly useInVmxRootOp: boolean;
/**
* `true` if it can be used outside an enclave (SGX)
*/
  readonly useOutsideEnclaveSgx: boolean;
/**
* `true` if it can be used outside SEAM
*/
  readonly useOutsideSeam: boolean;
/**
* `true` if it can be used outside SMM
*/
  readonly useOutsideSmm: boolean;
/**
* `true` if it can be used outside VMX operation
*/
  readonly useOutsideVmxOp: boolean;
/**
* `true` if it can be executed in virtual 8086 mode
*/
  readonly virtual8086Mode: boolean;
}
/**
* [`Register`] enum extension methods
*
* [`Register`]: enum.Register.html
*/
export class RegisterExt {
  free(): void;
/**
* Gets the base register, eg. `AL`, `AX`, `EAX`, `RAX`, `MM0`, `XMM0`, `YMM0`, `ZMM0`, `ES`
*
* # Arguments
*
* - `value`: A [`Register`] enum value
*
* [`Register`]: enum.Register.html
*
* # Examples
*
* ```js
* const assert = require("assert").strict;
* const { Register, RegisterExt } = require("iced-x86");
*
* assert.equal(RegisterExt.base(Register.GS), Register.ES);
* assert.equal(RegisterExt.base(Register.SIL), Register.AL);
* assert.equal(RegisterExt.base(Register.SP), Register.AX);
* assert.equal(RegisterExt.base(Register.R13D), Register.EAX);
* assert.equal(RegisterExt.base(Register.RBP), Register.RAX);
* assert.equal(RegisterExt.base(Register.MM6), Register.MM0);
* assert.equal(RegisterExt.base(Register.XMM28), Register.XMM0);
* assert.equal(RegisterExt.base(Register.YMM12), Register.YMM0);
* assert.equal(RegisterExt.base(Register.ZMM31), Register.ZMM0);
* assert.equal(RegisterExt.base(Register.K3), Register.K0);
* assert.equal(RegisterExt.base(Register.BND1), Register.BND0);
* assert.equal(RegisterExt.base(Register.ST7), Register.ST0);
* assert.equal(RegisterExt.base(Register.CR8), Register.CR0);
* assert.equal(RegisterExt.base(Register.DR6), Register.DR0);
* assert.equal(RegisterExt.base(Register.TR3), Register.TR0);
* assert.equal(RegisterExt.base(Register.RIP), Register.EIP);
* ```
* @param {Register} value
* @returns {Register}
*/
  static base(value: Register): Register;
/**
* The register number (index) relative to [`RegisterExt.base()`], eg. 0-15, or 0-31, or if 8-bit GPR, 0-19
*
* # Arguments
*
* - `value`: A [`Register`] enum value
*
* [`Register`]: enum.Register.html
* [`RegisterExt.base()`]: #method.base
*
* # Examples
*
* ```js
* const assert = require("assert").strict;
* const { Register, RegisterExt } = require("iced-x86");
*
* assert.equal(RegisterExt.number(Register.GS), 5);
* assert.equal(RegisterExt.number(Register.SIL), 10);
* assert.equal(RegisterExt.number(Register.SP), 4);
* assert.equal(RegisterExt.number(Register.R13D), 13);
* assert.equal(RegisterExt.number(Register.RBP), 5);
* assert.equal(RegisterExt.number(Register.MM6), 6);
* assert.equal(RegisterExt.number(Register.XMM28), 28);
* assert.equal(RegisterExt.number(Register.YMM12), 12);
* assert.equal(RegisterExt.number(Register.ZMM31), 31);
* assert.equal(RegisterExt.number(Register.K3), 3);
* assert.equal(RegisterExt.number(Register.BND1), 1);
* assert.equal(RegisterExt.number(Register.ST7), 7);
* assert.equal(RegisterExt.number(Register.CR8), 8);
* assert.equal(RegisterExt.number(Register.DR6), 6);
* assert.equal(RegisterExt.number(Register.TR3), 3);
* assert.equal(RegisterExt.number(Register.RIP), 1);
* ```
* @param {Register} value
* @returns {number}
*/
  static number(value: Register): number;
/**
* Gets the full register that this one is a part of, eg. `CL`/`CH`/`CX`/`ECX`/`RCX` -> `RCX`, `XMM11`/`YMM11`/`ZMM11` -> `ZMM11`
*
* # Arguments
*
* - `value`: A [`Register`] enum value
*
* [`Register`]: enum.Register.html
*
* # Examples
*
* ```js
* const assert = require("assert").strict;
* const { Register, RegisterExt } = require("iced-x86");
*
* assert.equal(RegisterExt.fullRegister(Register.GS), Register.GS);
* assert.equal(RegisterExt.fullRegister(Register.SIL), Register.RSI);
* assert.equal(RegisterExt.fullRegister(Register.SP), Register.RSP);
* assert.equal(RegisterExt.fullRegister(Register.R13D), Register.R13);
* assert.equal(RegisterExt.fullRegister(Register.RBP), Register.RBP);
* assert.equal(RegisterExt.fullRegister(Register.MM6), Register.MM6);
* assert.equal(RegisterExt.fullRegister(Register.XMM10), Register.ZMM10);
* assert.equal(RegisterExt.fullRegister(Register.YMM10), Register.ZMM10);
* assert.equal(RegisterExt.fullRegister(Register.ZMM10), Register.ZMM10);
* assert.equal(RegisterExt.fullRegister(Register.K3), Register.K3);
* assert.equal(RegisterExt.fullRegister(Register.BND1), Register.BND1);
* assert.equal(RegisterExt.fullRegister(Register.ST7), Register.ST7);
* assert.equal(RegisterExt.fullRegister(Register.CR8), Register.CR8);
* assert.equal(RegisterExt.fullRegister(Register.DR6), Register.DR6);
* assert.equal(RegisterExt.fullRegister(Register.TR3), Register.TR3);
* assert.equal(RegisterExt.fullRegister(Register.RIP), Register.RIP);
* ```
* @param {Register} value
* @returns {Register}
*/
  static fullRegister(value: Register): Register;
/**
* Gets the full register that this one is a part of, except if it's a GPR in which case the 32-bit register is returned,
* eg. `CL`/`CH`/`CX`/`ECX`/`RCX` -> `ECX`, `XMM11`/`YMM11`/`ZMM11` -> `ZMM11`
*
* # Arguments
*
* - `value`: A [`Register`] enum value
*
* [`Register`]: enum.Register.html
*
* # Examples
*
* ```js
* const assert = require("assert").strict;
* const { Register, RegisterExt } = require("iced-x86");
*
* assert.equal(RegisterExt.fullRegister32(Register.GS), Register.GS);
* assert.equal(RegisterExt.fullRegister32(Register.SIL), Register.ESI);
* assert.equal(RegisterExt.fullRegister32(Register.SP), Register.ESP);
* assert.equal(RegisterExt.fullRegister32(Register.R13D), Register.R13D);
* assert.equal(RegisterExt.fullRegister32(Register.RBP), Register.EBP);
* assert.equal(RegisterExt.fullRegister32(Register.MM6), Register.MM6);
* assert.equal(RegisterExt.fullRegister32(Register.XMM10), Register.ZMM10);
* assert.equal(RegisterExt.fullRegister32(Register.YMM10), Register.ZMM10);
* assert.equal(RegisterExt.fullRegister32(Register.ZMM10), Register.ZMM10);
* assert.equal(RegisterExt.fullRegister32(Register.K3), Register.K3);
* assert.equal(RegisterExt.fullRegister32(Register.BND1), Register.BND1);
* assert.equal(RegisterExt.fullRegister32(Register.ST7), Register.ST7);
* assert.equal(RegisterExt.fullRegister32(Register.CR8), Register.CR8);
* assert.equal(RegisterExt.fullRegister32(Register.DR6), Register.DR6);
* assert.equal(RegisterExt.fullRegister32(Register.TR3), Register.TR3);
* assert.equal(RegisterExt.fullRegister32(Register.RIP), Register.RIP);
* ```
* @param {Register} value
* @returns {Register}
*/
  static fullRegister32(value: Register): Register;
/**
* Gets the size of the register in bytes
*
* # Arguments
*
* - `value`: A [`Register`] enum value
*
* [`Register`]: enum.Register.html
*
* # Examples
*
* ```js
* const assert = require("assert").strict;
* const { Register, RegisterExt } = require("iced-x86");
*
* assert.equal(RegisterExt.size(Register.GS), 2);
* assert.equal(RegisterExt.size(Register.SIL), 1);
* assert.equal(RegisterExt.size(Register.SP), 2);
* assert.equal(RegisterExt.size(Register.R13D), 4);
* assert.equal(RegisterExt.size(Register.RBP), 8);
* assert.equal(RegisterExt.size(Register.MM6), 8);
* assert.equal(RegisterExt.size(Register.XMM10), 16);
* assert.equal(RegisterExt.size(Register.YMM10), 32);
* assert.equal(RegisterExt.size(Register.ZMM10), 64);
* assert.equal(RegisterExt.size(Register.K3), 8);
* assert.equal(RegisterExt.size(Register.BND1), 16);
* assert.equal(RegisterExt.size(Register.ST7), 10);
* assert.equal(RegisterExt.size(Register.CR8), 8);
* assert.equal(RegisterExt.size(Register.DR6), 8);
* assert.equal(RegisterExt.size(Register.TR3), 4);
* assert.equal(RegisterExt.size(Register.RIP), 8);
* ```
* @param {Register} value
* @returns {number}
*/
  static size(value: Register): number;
/**
* Checks if it's a segment register (`ES`, `CS`, `SS`, `DS`, `FS`, `GS`)
*
* # Arguments
*
* - `value`: A [`Register`] enum value
*
* [`Register`]: enum.Register.html
*
* # Examples
*
* ```js
* const assert = require("assert").strict;
* const { Register, RegisterExt } = require("iced-x86");
*
* assert.ok(RegisterExt.isSegmentRegister(Register.GS));
* assert.ok(!RegisterExt.isSegmentRegister(Register.RCX));
* ```
* @param {Register} value
* @returns {boolean}
*/
  static isSegmentRegister(value: Register): boolean;
/**
* Checks if it's a general purpose register (`AL`-`R15L`, `AX`-`R15W`, `EAX`-`R15D`, `RAX`-`R15`)
*
* # Arguments
*
* - `value`: A [`Register`] enum value
*
* [`Register`]: enum.Register.html
*
* # Examples
*
* ```js
* const assert = require("assert").strict;
* const { Register, RegisterExt } = require("iced-x86");
*
* assert.ok(!RegisterExt.isGPR(Register.GS));
* assert.ok(RegisterExt.isGPR(Register.CH));
* assert.ok(RegisterExt.isGPR(Register.DX));
* assert.ok(RegisterExt.isGPR(Register.R13D));
* assert.ok(RegisterExt.isGPR(Register.RSP));
* assert.ok(!RegisterExt.isGPR(Register.XMM0));
* ```
* @param {Register} value
* @returns {boolean}
*/
  static isGPR(value: Register): boolean;
/**
* Checks if it's an 8-bit general purpose register (`AL`-`R15L`)
*
* # Arguments
*
* - `value`: A [`Register`] enum value
*
* [`Register`]: enum.Register.html
*
* # Examples
*
* ```js
* const assert = require("assert").strict;
* const { Register, RegisterExt } = require("iced-x86");
*
* assert.ok(!RegisterExt.isGPR8(Register.GS));
* assert.ok(RegisterExt.isGPR8(Register.CH));
* assert.ok(!RegisterExt.isGPR8(Register.DX));
* assert.ok(!RegisterExt.isGPR8(Register.R13D));
* assert.ok(!RegisterExt.isGPR8(Register.RSP));
* assert.ok(!RegisterExt.isGPR8(Register.XMM0));
* ```
* @param {Register} value
* @returns {boolean}
*/
  static isGPR8(value: Register): boolean;
/**
* Checks if it's a 16-bit general purpose register (`AX`-`R15W`)
*
* # Arguments
*
* - `value`: A [`Register`] enum value
*
* [`Register`]: enum.Register.html
*
* # Examples
*
* ```js
* const assert = require("assert").strict;
* const { Register, RegisterExt } = require("iced-x86");
*
* assert.ok(!RegisterExt.isGPR16(Register.GS));
* assert.ok(!RegisterExt.isGPR16(Register.CH));
* assert.ok(RegisterExt.isGPR16(Register.DX));
* assert.ok(!RegisterExt.isGPR16(Register.R13D));
* assert.ok(!RegisterExt.isGPR16(Register.RSP));
* assert.ok(!RegisterExt.isGPR16(Register.XMM0));
* ```
* @param {Register} value
* @returns {boolean}
*/
  static isGPR16(value: Register): boolean;
/**
* Checks if it's a 32-bit general purpose register (`EAX`-`R15D`)
*
* # Arguments
*
* - `value`: A [`Register`] enum value
*
* [`Register`]: enum.Register.html
*
* # Examples
*
* ```js
* const assert = require("assert").strict;
* const { Register, RegisterExt } = require("iced-x86");
*
* assert.ok(!RegisterExt.isGPR32(Register.GS));
* assert.ok(!RegisterExt.isGPR32(Register.CH));
* assert.ok(!RegisterExt.isGPR32(Register.DX));
* assert.ok(RegisterExt.isGPR32(Register.R13D));
* assert.ok(!RegisterExt.isGPR32(Register.RSP));
* assert.ok(!RegisterExt.isGPR32(Register.XMM0));
* ```
* @param {Register} value
* @returns {boolean}
*/
  static isGPR32(value: Register): boolean;
/**
* Checks if it's a 64-bit general purpose register (`RAX`-`R15`)
*
* # Arguments
*
* - `value`: A [`Register`] enum value
*
* [`Register`]: enum.Register.html
*
* # Examples
*
* ```js
* const assert = require("assert").strict;
* const { Register, RegisterExt } = require("iced-x86");
*
* assert.ok(!RegisterExt.isGPR64(Register.GS));
* assert.ok(!RegisterExt.isGPR64(Register.CH));
* assert.ok(!RegisterExt.isGPR64(Register.DX));
* assert.ok(!RegisterExt.isGPR64(Register.R13D));
* assert.ok(RegisterExt.isGPR64(Register.RSP));
* assert.ok(!RegisterExt.isGPR64(Register.XMM0));
* ```
* @param {Register} value
* @returns {boolean}
*/
  static isGPR64(value: Register): boolean;
/**
* Checks if it's a 128-bit vector register (`XMM0`-`XMM31`)
*
* # Arguments
*
* - `value`: A [`Register`] enum value
*
* [`Register`]: enum.Register.html
*
* # Examples
*
* ```js
* const assert = require("assert").strict;
* const { Register, RegisterExt } = require("iced-x86");
*
* assert.ok(!RegisterExt.isXMM(Register.R13D));
* assert.ok(!RegisterExt.isXMM(Register.RSP));
* assert.ok(RegisterExt.isXMM(Register.XMM0));
* assert.ok(!RegisterExt.isXMM(Register.YMM0));
* assert.ok(!RegisterExt.isXMM(Register.ZMM0));
* ```
* @param {Register} value
* @returns {boolean}
*/
  static isXMM(value: Register): boolean;
/**
* Checks if it's a 256-bit vector register (`YMM0`-`YMM31`)
*
* # Arguments
*
* - `value`: A [`Register`] enum value
*
* [`Register`]: enum.Register.html
*
* # Examples
*
* ```js
* const assert = require("assert").strict;
* const { Register, RegisterExt } = require("iced-x86");
*
* assert.ok(!RegisterExt.isYMM(Register.R13D));
* assert.ok(!RegisterExt.isYMM(Register.RSP));
* assert.ok(!RegisterExt.isYMM(Register.XMM0));
* assert.ok(RegisterExt.isYMM(Register.YMM0));
* assert.ok(!RegisterExt.isYMM(Register.ZMM0));
* ```
* @param {Register} value
* @returns {boolean}
*/
  static isYMM(value: Register): boolean;
/**
* Checks if it's a 512-bit vector register (`ZMM0`-`ZMM31`)
*
* # Arguments
*
* - `value`: A [`Register`] enum value
*
* [`Register`]: enum.Register.html
*
* # Examples
*
* ```js
* const assert = require("assert").strict;
* const { Register, RegisterExt } = require("iced-x86");
*
* assert.ok(!RegisterExt.isZMM(Register.R13D));
* assert.ok(!RegisterExt.isZMM(Register.RSP));
* assert.ok(!RegisterExt.isZMM(Register.XMM0));
* assert.ok(!RegisterExt.isZMM(Register.YMM0));
* assert.ok(RegisterExt.isZMM(Register.ZMM0));
* ```
* @param {Register} value
* @returns {boolean}
*/
  static isZMM(value: Register): boolean;
/**
* Checks if it's an `XMM`, `YMM` or `ZMM` register
*
* # Arguments
*
* - `value`: A [`Register`] enum value
*
* [`Register`]: enum.Register.html
*
* # Examples
*
* ```js
* const assert = require("assert").strict;
* const { Register, RegisterExt } = require("iced-x86");
*
* assert.ok(!RegisterExt.isVectorRegister(Register.R13D));
* assert.ok(!RegisterExt.isVectorRegister(Register.RSP));
* assert.ok(RegisterExt.isVectorRegister(Register.XMM0));
* assert.ok(RegisterExt.isVectorRegister(Register.YMM0));
* assert.ok(RegisterExt.isVectorRegister(Register.ZMM0));
* ```
* @param {Register} value
* @returns {boolean}
*/
  static isVectorRegister(value: Register): boolean;
/**
* Checks if it's `EIP`/`RIP`
*
* # Arguments
*
* - `value`: A [`Register`] enum value
*
* [`Register`]: enum.Register.html
*
* # Examples
*
* ```js
* const assert = require("assert").strict;
* const { Register, RegisterExt } = require("iced-x86");
*
* assert.ok(RegisterExt.isIP(Register.EIP));
* assert.ok(RegisterExt.isIP(Register.RIP));
* ```
* @param {Register} value
* @returns {boolean}
*/
  static isIP(value: Register): boolean;
/**
* Checks if it's an opmask register (`K0`-`K7`)
*
* # Arguments
*
* - `value`: A [`Register`] enum value
*
* [`Register`]: enum.Register.html
*
* # Examples
*
* ```js
* const assert = require("assert").strict;
* const { Register, RegisterExt } = require("iced-x86");
*
* assert.ok(!RegisterExt.isK(Register.R13D));
* assert.ok(RegisterExt.isK(Register.K3));
* ```
* @param {Register} value
* @returns {boolean}
*/
  static isK(value: Register): boolean;
/**
* Checks if it's a control register (`CR0`-`CR15`)
*
* # Arguments
*
* - `value`: A [`Register`] enum value
*
* [`Register`]: enum.Register.html
*
* # Examples
*
* ```js
* const assert = require("assert").strict;
* const { Register, RegisterExt } = require("iced-x86");
*
* assert.ok(!RegisterExt.isCR(Register.R13D));
* assert.ok(RegisterExt.isCR(Register.CR3));
* ```
* @param {Register} value
* @returns {boolean}
*/
  static isCR(value: Register): boolean;
/**
* Checks if it's a debug register (`DR0`-`DR15`)
*
* # Arguments
*
* - `value`: A [`Register`] enum value
*
* [`Register`]: enum.Register.html
*
* # Examples
*
* ```js
* const assert = require("assert").strict;
* const { Register, RegisterExt } = require("iced-x86");
*
* assert.ok(!RegisterExt.isDR(Register.R13D));
* assert.ok(RegisterExt.isDR(Register.DR3));
* ```
* @param {Register} value
* @returns {boolean}
*/
  static isDR(value: Register): boolean;
/**
* Checks if it's a test register (`TR0`-`TR7`)
*
* # Arguments
*
* - `value`: A [`Register`] enum value
*
* [`Register`]: enum.Register.html
*
* # Examples
*
* ```js
* const assert = require("assert").strict;
* const { Register, RegisterExt } = require("iced-x86");
*
* assert.ok(!RegisterExt.isTR(Register.R13D));
* assert.ok(RegisterExt.isTR(Register.TR3));
* ```
* @param {Register} value
* @returns {boolean}
*/
  static isTR(value: Register): boolean;
/**
* Checks if it's an FPU stack register (`ST0`-`ST7`)
*
* # Arguments
*
* - `value`: A [`Register`] enum value
*
* [`Register`]: enum.Register.html
*
* # Examples
*
* ```js
* const assert = require("assert").strict;
* const { Register, RegisterExt } = require("iced-x86");
*
* assert.ok(!RegisterExt.isST(Register.R13D));
* assert.ok(RegisterExt.isST(Register.ST3));
* ```
* @param {Register} value
* @returns {boolean}
*/
  static isST(value: Register): boolean;
/**
* Checks if it's a bound register (`BND0`-`BND3`)
*
* # Arguments
*
* - `value`: A [`Register`] enum value
*
* [`Register`]: enum.Register.html
*
* # Examples
*
* ```js
* const assert = require("assert").strict;
* const { Register, RegisterExt } = require("iced-x86");
*
* assert.ok(!RegisterExt.isBND(Register.R13D));
* assert.ok(RegisterExt.isBND(Register.BND3));
* ```
* @param {Register} value
* @returns {boolean}
*/
  static isBND(value: Register): boolean;
/**
* Checks if it's an MMX register (`MM0`-`MM7`)
*
* # Arguments
*
* - `value`: A [`Register`] enum value
*
* [`Register`]: enum.Register.html
*
* # Examples
*
* ```js
* const assert = require("assert").strict;
* const { Register, RegisterExt } = require("iced-x86");
*
* assert.ok(!RegisterExt.isMM(Register.R13D));
* assert.ok(RegisterExt.isMM(Register.MM3));
* ```
* @param {Register} value
* @returns {boolean}
*/
  static isMM(value: Register): boolean;
/**
* Checks if it's a tile register (`TMM0`-`TMM7`)
*
* # Arguments
*
* - `value`: A [`Register`] enum value
*
* [`Register`]: enum.Register.html
*
* # Examples
*
* ```js
* const assert = require("assert").strict;
* const { Register, RegisterExt } = require("iced-x86");
*
* assert.ok(!RegisterExt.isTMM(Register.R13D));
* assert.ok(RegisterExt.isTMM(Register.TMM3));
* ```
* @param {Register} value
* @returns {boolean}
*/
  static isTMM(value: Register): boolean;
}
/**
* A memory location used by an instruction
*/
export class UsedMemory {
  free(): void;
/**
* Memory access (an [`OpAccess`] enum value)
*
* [`OpAccess`]: enum.OpAccess.html
*/
  readonly access: OpAccess;
/**
* Base register (a [`Register`] enum value) or [`Register.None`] if none
*
* [`Register`]: struct.Register.html
* [`Register.None`]: enum.Register.html#variant.None
*/
  readonly base: Register;
/**
* Displacement
*/
  readonly displacement: bigint;
/**
* Index register (a [`Register`] enum value) or [`Register.None`] if none
*
* [`Register`]: struct.Register.html
* [`Register.None`]: enum.Register.html#variant.None
*/
  readonly index: Register;
/**
* Size of location (a [`MemorySize`] enum value)
*
* [`MemorySize`]: enum.MemorySize.html
*/
  readonly memorySize: MemorySize;
/**
* Index scale (1, 2, 4 or 8)
*/
  readonly scale: number;
/**
* Effective segment register (a [`Register`] enum value) or [`Register.None`] if the segment register is ignored
*
* [`Register`]: struct.Register.html
* [`Register.None`]: enum.Register.html#variant.None
*/
  readonly segment: Register;
}
/**
* A register used by an instruction
*/
export class UsedRegister {
  free(): void;
/**
* Gets the register access (an [`OpAccess`] enum value)
*
* [`OpAccess`]: enum.OpAccess.html
*/
  readonly access: OpAccess;
/**
* Gets the register (a [`Register`] enum value)
*
* [`Register`]: struct.Register.html
*/
  readonly register: Register;
}
