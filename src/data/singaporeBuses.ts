import { BusStop } from '../types/bus';

// Accurate coordinates of prominent Singapore bus stops
export const SINGAPORE_BUS_STOPS: BusStop[] = [
  // --- Central / Orchard / Dhoby Ghaut / City Hall / Marina Bay ---
  {
    BusStopCode: '08057',
    RoadName: 'Orchard Rd',
    Description: 'Dhoby Ghaut Stn',
    Latitude: 1.2993,
    Longitude: 103.8458,
    Region: 'Central',
    Services: ['7', '14', '16', '36', '65', '111', '124', '166', '174', '190', '857']
  },
  {
    BusStopCode: '09048',
    RoadName: 'Orchard Rd',
    Description: 'Orchard Stn / Lucky Plaza',
    Latitude: 1.3039,
    Longitude: 103.8340,
    Region: 'Central',
    Services: ['7', '14', '16', '65', '111', '124', '143', '166', '174', '190']
  },
  {
    BusStopCode: '09022',
    RoadName: 'Orchard Rd',
    Description: 'Orchard Stn / Tang Plaza',
    Latitude: 1.3048,
    Longitude: 103.8324,
    Region: 'Central',
    Services: ['36', '77', '124', '143', '167', '190', '960', '972']
  },
  {
    BusStopCode: '09037',
    RoadName: 'Orchard Rd',
    Description: 'Opp Mandarin Orchard',
    Latitude: 1.3015,
    Longitude: 103.8368,
    Region: 'Central',
    Services: ['7', '14', '16', '36', '65', '77', '106', '111', '123', '174']
  },
  {
    BusStopCode: '08031',
    RoadName: 'Bras Basah Rd',
    Description: 'Rendezvous Grand Hotel',
    Latitude: 1.2982,
    Longitude: 103.8504,
    Region: 'Central',
    Services: ['7', '14', '16', '36', '77', '106', '111', '131', '166', '174', '857']
  },
  {
    BusStopCode: '04168',
    RoadName: 'Bras Basah Rd',
    Description: 'NTUC Income Ctr',
    Latitude: 1.2965,
    Longitude: 103.8529,
    Region: 'Central',
    Services: ['7', '14', '16', '36', '77', '106', '111', '130', '131', '167']
  },
  {
    BusStopCode: '04179',
    RoadName: 'Bras Basah Rd',
    Description: 'Raffles Hotel',
    Latitude: 1.2947,
    Longitude: 103.8550,
    Region: 'Central',
    Services: ['14', '16', '36', '77', '106', '111', '130', '131', '133', '167', '857', '960']
  },
  {
    BusStopCode: '04229',
    RoadName: 'North Bridge Rd',
    Description: 'City Hall Stn Exit B',
    Latitude: 1.2929,
    Longitude: 103.8526,
    Region: 'Central',
    Services: ['61', '124', '145', '166', '174', '197', '851', '960']
  },
  {
    BusStopCode: '03019',
    RoadName: 'Collyer Quay',
    Description: 'Fullerton Sq / Raffles Pl',
    Latitude: 1.2858,
    Longitude: 103.8529,
    Region: 'Central',
    Services: ['10', '70', '100', '107', '130', '131', '167', '196']
  },
  {
    BusStopCode: '03218',
    RoadName: 'Central Blvd',
    Description: 'Opp Downtown Stn',
    Latitude: 1.2798,
    Longitude: 103.8527,
    Region: 'Central',
    Services: ['97', '106', '133', '400', '502', '513', '970']
  },
  {
    BusStopCode: '03539',
    RoadName: 'Bayfront Ave',
    Description: 'Marina Bay Sands MICE',
    Latitude: 1.2829,
    Longitude: 103.8576,
    Region: 'Central',
    Services: ['97', '106', '133', '502', '518']
  },
  {
    BusStopCode: '03511',
    RoadName: 'Bayfront Ave',
    Description: 'Marina Bay Sands Hotel',
    Latitude: 1.2842,
    Longitude: 103.8596,
    Region: 'Central',
    Services: ['97', '106', '133', '502', '518']
  },
  {
    BusStopCode: '01112',
    RoadName: 'Victoria St',
    Description: 'Bugis Junction',
    Latitude: 1.3005,
    Longitude: 103.8559,
    Region: 'Central',
    Services: ['2', '12', '33', '130', '133', '960', '980']
  },
  {
    BusStopCode: '01119',
    RoadName: 'Victoria St',
    Description: 'Bugis Stn Exit B',
    Latitude: 1.3014,
    Longitude: 103.8570,
    Region: 'Central',
    Services: ['2', '12', '32', '33', '51', '61', '63', '80', '145', '175', '197']
  },
  {
    BusStopCode: '05013',
    RoadName: 'Eu Tong Sen St',
    Description: 'Chinatown Stn Exit C',
    Latitude: 1.2848,
    Longitude: 103.8441,
    Region: 'Central',
    Services: ['2', '12', '33', '54', '61', '143', '147', '190']
  },

  // --- West / Jurong East / Clementi / Buona Vista ---
  {
    BusStopCode: '28009',
    RoadName: 'Jurong Gateway Rd',
    Description: 'Jurong East Temp Int',
    Latitude: 1.3337,
    Longitude: 103.7423,
    Region: 'West',
    Services: ['51', '52', '66', '78', '79', '97', '98', '105', '143', '160', '183', '197', '333', '334', '506']
  },
  {
    BusStopCode: '28211',
    RoadName: 'Jurong Gateway Rd',
    Description: 'Opp Jurong East Stn',
    Latitude: 1.3345,
    Longitude: 103.7431,
    Region: 'West',
    Services: ['51', '78', '79', '98', '143', '183', '197', '333']
  },
  {
    BusStopCode: '17009',
    RoadName: 'Clementi Ave 3',
    Description: 'Clementi Int',
    Latitude: 1.3151,
    Longitude: 103.7654,
    Region: 'West',
    Services: ['14', '52', '96', '99', '147', '156', '165', '166', '175', '196', '282', '284', '285']
  },
  {
    BusStopCode: '11361',
    RoadName: 'Nth Buona Vista Rd',
    Description: 'Buona Vista Stn Exit C',
    Latitude: 1.3069,
    Longitude: 103.7904,
    Region: 'West',
    Services: ['14', '74', '91', '92', '95', '100', '196', '198', '200']
  },
  {
    BusStopCode: '20061',
    RoadName: 'Jurong West Central 3',
    Description: 'Boon Lay Int',
    Latitude: 1.3392,
    Longitude: 103.7058,
    Region: 'West',
    Services: ['30', '79', '154', '178', '180', '192', '193', '194', '240', '241', '242', '243']
  },

  // --- North / Woodlands / Bishan / Ang Mo Kio / Toa Payoh ---
  {
    BusStopCode: '46009',
    RoadName: 'Woodlands Sq',
    Description: 'Woodlands Temp Int',
    Latitude: 1.4371,
    Longitude: 103.7865,
    Region: 'North',
    Services: ['161', '168', '169', '178', '187', '856', '900', '901', '903', '911', '912', '913', '925', '960', '961', '962', '963', '964', '965', '966', '969']
  },
  {
    BusStopCode: '54009',
    RoadName: 'Bishan Pl',
    Description: 'Bishan Int',
    Latitude: 1.3508,
    Longitude: 103.8488,
    Region: 'North',
    Services: ['52', '53', '54', '55', '56', '57', '58', '59', '410G', '410W']
  },
  {
    BusStopCode: '54261',
    RoadName: 'Bishan Rd',
    Description: 'Bishan Stn',
    Latitude: 1.3501,
    Longitude: 103.8499,
    Region: 'North',
    Services: ['52', '54', '55', '56', '57', '58', '59', '88']
  },
  {
    BusStopCode: '53009',
    RoadName: 'AMK Ave 8',
    Description: 'Ang Mo Kio Int',
    Latitude: 1.3698,
    Longitude: 103.8496,
    Region: 'North',
    Services: ['24', '25', '73', '86', '130', '133', '135', '136', '138', '166', '169', '261', '262', '265', '269']
  },
  {
    BusStopCode: '52009',
    RoadName: 'Lor 6 Toa Payoh',
    Description: 'Toa Payoh Int',
    Latitude: 1.3328,
    Longitude: 103.8475,
    Region: 'North',
    Services: ['26', '28', '31', '73', '88', '139', '141', '142', '143', '145', '155', '157', '159', '163', '231', '232', '235', '238']
  },
  {
    BusStopCode: '59009',
    RoadName: 'Yishun Ave 2',
    Description: 'Yishun Int',
    Latitude: 1.4294,
    Longitude: 103.8350,
    Region: 'North',
    Services: ['39', '85', '103', '171', '800', '804', '806', '811', '812', '851', '852', '853', '854', '855', '857', '859']
  },

  // --- East / Tampines / Bedok / Marine Parade / Changi Airport ---
  {
    BusStopCode: '83139',
    RoadName: 'Marine Parade Rd',
    Description: 'Opp Parkway Parade',
    Latitude: 1.3015,
    Longitude: 103.9052,
    Region: 'East',
    Services: ['15', '31', '36', '43', '48', '134', '135', '196', '197', '966']
  },
  {
    BusStopCode: '75009',
    RoadName: 'Tampines Ave 7',
    Description: 'Tampines Int',
    Latitude: 1.3541,
    Longitude: 103.9431,
    Region: 'East',
    Services: ['3', '4', '8', '10', '19', '20', '23', '28', '29', '37', '38', '46', '65', '67', '68', '69', '72', '81', '127', '291', '292', '293', '969']
  },
  {
    BusStopCode: '84009',
    RoadName: 'Bedok North Ave 1',
    Description: 'Bedok Int',
    Latitude: 1.3244,
    Longitude: 103.9300,
    Region: 'East',
    Services: ['7', '9', '14', '16', '17', '18', '25', '26', '30', '32', '33', '35', '38', '40', '60', '66', '69', '87', '196', '197', '222', '225', '228', '229']
  },
  {
    BusStopCode: '80019',
    RoadName: 'Jalan Eunos',
    Description: 'Eunos Stn / Int',
    Latitude: 1.3197,
    Longitude: 103.9031,
    Region: 'East',
    Services: ['2', '7', '15', '21', '25', '51', '55', '60', '61', '63', '76', '93', '94', '154']
  },
  {
    BusStopCode: '95109',
    RoadName: 'PTB2 Basement',
    Description: 'Changi Airport PTB2',
    Latitude: 1.3549,
    Longitude: 103.9893,
    Region: 'East',
    Services: ['24', '27', '34', '36', '53', '110', '858']
  },
  {
    BusStopCode: '82009',
    RoadName: 'Paya Lebar Rd',
    Description: 'Paya Lebar Stn Exit B',
    Latitude: 1.3178,
    Longitude: 103.8924,
    Region: 'East',
    Services: ['24', '28', '43', '70', '76', '134', '135', '137', '154', '155']
  },

  // --- North-East / Serangoon / Sengkang / Punggol ---
  {
    BusStopCode: '66009',
    RoadName: 'Serangoon Ave 2',
    Description: 'Serangoon Int / Nex',
    Latitude: 1.3503,
    Longitude: 103.8735,
    Region: 'North-East',
    Services: ['100', '101', '103', '105', '109', '158', '315', '317']
  },
  {
    BusStopCode: '67009',
    RoadName: 'Sengkang Sq',
    Description: 'Sengkang Int / Compass One',
    Latitude: 1.3916,
    Longitude: 103.8953,
    Region: 'North-East',
    Services: ['80', '83', '85', '86', '87', '156', '159', '163', '371', '372', '374', '965']
  },
  {
    BusStopCode: '65009',
    RoadName: 'Punggol Pl',
    Description: 'Punggol Temp Int / Waterway',
    Latitude: 1.4044,
    Longitude: 103.9022,
    Region: 'North-East',
    Services: ['3', '34', '43', '62', '82', '83', '84', '85', '118', '136', '381', '382', '384', '386']
  }
];

// Major iconic Singapore Bus Services with defined route sequences
export interface BusRouteDefinition {
  serviceNo: string;
  origin: string;
  destination: string;
  operator: 'SBST' | 'SMRT' | 'TTS' | 'GAS';
  stopCodes: string[];
}

export const SINGAPORE_BUS_ROUTES: BusRouteDefinition[] = [
  {
    serviceNo: '190',
    origin: 'Choa Chu Kang Int',
    destination: 'Kampong Bahru Ter',
    operator: 'SMRT',
    stopCodes: ['09022', '09048', '09037', '08057', '08031', '04229', '05013']
  },
  {
    serviceNo: '7',
    origin: 'Bedok Int',
    destination: 'Clementi Int',
    operator: 'SBST',
    stopCodes: ['84009', '80019', '01119', '08031', '08057', '09037', '09048', '11361', '17009']
  },
  {
    serviceNo: '14',
    origin: 'Bedok Int',
    destination: 'Clementi Int',
    operator: 'SBST',
    stopCodes: ['84009', '04179', '04168', '08031', '08057', '09037', '09048', '11361', '17009']
  },
  {
    serviceNo: '36',
    origin: 'Changi Airport PTB2',
    destination: 'Tomlinson Rd (Loop)',
    operator: 'GAS',
    stopCodes: ['95109', '04179', '04168', '08031', '08057', '09037', '09022']
  },
  {
    serviceNo: '65',
    origin: 'Tampines Int',
    destination: 'HarbourFront Int',
    operator: 'SBST',
    stopCodes: ['75009', '01112', '08057', '09037', '09048']
  },
  {
    serviceNo: '166',
    origin: 'Ang Mo Kio Int',
    destination: 'Clementi Int',
    operator: 'SBST',
    stopCodes: ['53009', '08057', '09048', '04229', '17009']
  },
  {
    serviceNo: '174',
    origin: 'Boon Lay Int',
    destination: 'Kampong Bahru Ter',
    operator: 'SBST',
    stopCodes: ['20061', '09048', '09037', '08057', '08031', '04229']
  },
  {
    serviceNo: '857',
    origin: 'Yishun Int',
    destination: 'Suntec City (Loop)',
    operator: 'TTS',
    stopCodes: ['59009', '08057', '08031', '04179']
  },
  {
    serviceNo: '960',
    origin: 'Woodlands Temp Int',
    destination: 'Marina Ctr Ter',
    operator: 'SMRT',
    stopCodes: ['46009', '09022', '04179', '04229', '01112']
  },
  {
    serviceNo: '10',
    origin: 'Tampines Int',
    destination: 'Kent Ridge Ter',
    operator: 'SBST',
    stopCodes: ['75009', '82009', '03019', '03218']
  },
  {
    serviceNo: '143',
    origin: 'Toa Payoh Int',
    destination: 'Jurong East Int',
    operator: 'TTS',
    stopCodes: ['52009', '09022', '09048', '05013', '28009', '28211']
  },
  {
    serviceNo: '106',
    origin: 'Bukit Batok Int',
    destination: 'Shenton Way Ter',
    operator: 'TTS',
    stopCodes: ['09037', '08031', '04168', '04179', '03218', '03539', '03511']
  }
];

// Notable hubs in Singapore for quick location teleporting in simulation
export interface SingaporeHub {
  name: string;
  description: string;
  lat: number;
  lng: number;
  defaultStopCode: string;
}

export const SINGAPORE_HUBS: SingaporeHub[] = [
  {
    name: 'Orchard Rd / Dhoby Ghaut',
    description: 'Central Shopping & Transit Node',
    lat: 1.2993,
    lng: 103.8458,
    defaultStopCode: '08057'
  },
  {
    name: 'Marina Bay Sands / Downtown',
    description: 'Financial District & Waterfront',
    lat: 1.2829,
    lng: 103.8576,
    defaultStopCode: '03539'
  },
  {
    name: 'Bugis & City Hall',
    description: 'Civic District & Cultural Corridor',
    lat: 1.3005,
    lng: 103.8559,
    defaultStopCode: '01112'
  },
  {
    name: 'Jurong East Gateway',
    description: 'Western Regional Commercial Hub',
    lat: 1.3337,
    lng: 103.7423,
    defaultStopCode: '28009'
  },
  {
    name: 'Woodlands Square',
    description: 'Northern Regional Hub & Causeway Gateway',
    lat: 1.4371,
    lng: 103.7865,
    defaultStopCode: '46009'
  },
  {
    name: 'Tampines Central',
    description: 'Eastern Commercial & Transit Center',
    lat: 1.3541,
    lng: 103.9431,
    defaultStopCode: '75009'
  },
  {
    name: 'Bishan Junction 8',
    description: 'Central North Transit Crossway',
    lat: 1.3508,
    lng: 103.8488,
    defaultStopCode: '54009'
  },
  {
    name: 'Changi Airport Terminal 2',
    description: 'International Aviation Hub',
    lat: 1.3549,
    lng: 103.9893,
    defaultStopCode: '95109'
  }
];
