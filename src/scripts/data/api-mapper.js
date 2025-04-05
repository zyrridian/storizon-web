// import Map from '../utils/map';

// export async function reportMapper(reports) {
//   return {
//     ...reports,
//       placeName: await Map.getPlaceNameByCoordinate(reports.lat, reports.lon),
//   };

// const mappedReports = await Promise.all(
//   reports.map(async (report) => ({
//     ...report,
//     location: {
//       lat: report.lat,
//       lon: report.lon,
//       placeName: await Map.getPlaceNameByCoordinate(report.lat, report.lon),
//     },
//   })),
// );

// return mappedReports;
// }

import Map from '../utils/map';

export async function reportMapper(reports) {
  const isArray = Array.isArray(reports);

  const mapReport = async (report) => ({
    ...report,
    placeName: await Map.getPlaceNameByCoordinate(report.lat, report.lon),
  });

  if (isArray) {
    return Promise.all(reports.map(mapReport));
  } else {
    return mapReport(reports);
  }
}

// import Map from '../utils/map';

// export async function reportMapper(reports) {
//   // Handle array of reports
//   if (Array.isArray(reports)) {
//     const mappedReports = await Promise.all(
//       reports.map(async (report) => ({
//         ...report,
//         location: {
//           lat: report.lat,
//           lon: report.lon,
//           placeName: await Map.getPlaceNameByCoordinate(report.lat, report.lon),
//         },
//       })),
//     );
//     return mappedReports;
//   }

//   // Handle single report object
//   return {
//     ...reports,
//     location: {
//       lat: reports.lat,
//       lon: reports.lon,
//       placeName: await Map.getPlaceNameByCoordinate(reports.lat, reports.lon),
//     },
//   };
// }
