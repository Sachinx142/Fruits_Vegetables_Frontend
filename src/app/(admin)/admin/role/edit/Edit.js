// "use client"

// import React, { Fragment } from 'react'
// import { useForm } from 'react-hook-form'
// import { useState, useRef, useEffect, useMemo } from "react";
// import { useRouter, useSearchParams } from "next/navigation";
// import axios from "axios";
// import Link from 'next/link';
// import { toast } from 'react-toastify';
// import usePermission from '@/_helper/frontend/Permission';

// const Edit = () => {

//     const { register, handleSubmit, setValue, formState: { isSubmitting, errors } } = useForm()
//     const router = useRouter();
//     const [menuData, setMenuData] = useState();
//     const [permissions, setPermissions] = useState([]);
//     const searchParams = useSearchParams();
//     const id = searchParams.get("id");

//     const handleChecked = (mainIndex, menuId, service) => {
//         setPermissions((prevPermission) => {
//             let updatedPermission = [...prevPermission];
//             updatedPermission[mainIndex] = [...(updatedPermission[mainIndex] || [])];

//             if (!updatedPermission[mainIndex]?.includes(menuId)) {
//                 updatedPermission[mainIndex]?.push(menuId)
//             }

//             if (!updatedPermission[mainIndex].includes(service)) {
//                 updatedPermission[mainIndex].push(service)
//             } else {
//                 updatedPermission[mainIndex] = updatedPermission[mainIndex]?.filter((ele) => ele != service)
//             }

//             return updatedPermission
//         })
//     };

//     const handleAllChecked = (mainIndex, menuId, service_1, service_2, service_3, service_4, service_5) => {
//         setPermissions((prevPermission) => {
//             let updatedPermission = [...prevPermission];
//             updatedPermission[mainIndex] = [...(updatedPermission[mainIndex] || [])]

//             if (!updatedPermission[mainIndex]?.includes(menuId)) {
//                 updatedPermission[mainIndex] = [...updatedPermission[mainIndex], menuId, service_1, service_2, service_3, service_4, service_5]
//             } else {
//                 if (!updatedPermission[mainIndex]?.includes(service_1) || !updatedPermission[mainIndex]?.includes(service_2) || !updatedPermission[mainIndex]?.includes(service_3) || !updatedPermission[mainIndex]?.includes(service_4) || !updatedPermission[mainIndex]?.includes(service_5)) {
//                     updatedPermission[mainIndex] = [];
//                     updatedPermission[mainIndex] = [...updatedPermission[mainIndex], menuId, service_1, service_2, service_3, service_4, service_5]
//                 } else {
//                     updatedPermission[mainIndex] = [];
//                 }
//             }

//             return updatedPermission
//         })
//     }

//     const onSubmit = async (data) => {
//         try {
//             const res = await axios.post("/api/roles/updateRoles", {
//                 roleName: data.roleName,
//                 permissions: permissions,
//                 id: id
//             });
//             if (res.data.status == 1) {
//                 router.push("/admin/role");
//                 toast.success(res.data.message);
//             }
//         } catch (err) {
//             console.log(err);
//         }
//     }

//     const getMenuData = async () => {
//         try {
//             const res = await axios.get("/api/menu/getMenuData");
//             if (res.data.status == 1) {
//                 setMenuData(res.data.data);
//             }
//         } catch (err) {
//             console.log(err);
//         }
//     }



//     useEffect(() => {
//         getMenuData();
//     }, [])

//     //Permission Logic
//     const menuId = "6887a1641101efd2b637d2ea"
//     const { getPermissionsBymenuId, isLoaded } = usePermission(menuId);

//     useEffect(() => {
//         if (!isLoaded) return; 

//         if (!getPermissionsBymenuId("service_2") || !getPermissionsBymenuId("service_3")) {
//             router.push("/admin");
//         }
//     }, [isLoaded]);


//     const getPermissionByRole = async () => {
//         try {
//             const res = await axios.post("/api/roles/getPermissionByRoleId", { roleId: id });
//             if (res.data.status == 1) {
//                 let permissionData = res.data.data;
//                 permissionData = permissionData?.map((ele) => {
//                     let perms = [ele.menuId];
//                     if (ele.service_1) perms.push("Create");
//                     if (ele.service_2) perms.push("View");
//                     if (ele.service_3) perms.push("Update");
//                     if (ele.service_4) perms.push("Delete");
//                     if (ele.service_5) perms.push("Active/Inactive");
//                     return perms;
//                 });


//                 const alignedPermissions = menuData?.map((menu) => {
//                     const matched = permissionData.find((perm) => perm[0] === menu._id);
//                     return matched || null;
//                 });


//                 setPermissions(alignedPermissions);

//                 setValue("roleName", res.data.roleName)
//             }
//         } catch (err) {
//             console.log(err);
//         }
//     }
//     useEffect(() => {
//         if (menuData && id) {
//             getPermissionByRole();
//         }
//     }, [id, menuData]);


//     return (
//         <>
//             <div className="content-wrapper">
//                 <div className="container-full">
//                     <section className="content">
//                         <div className="card">
//                             <div className="card-body">
//                                 <ul className="nav nav-tabs nav-bordered mb-3 d-flex justify-content-between">
//                                     <li className="nav-item">
//                                         <a href="#" data-bs-toggle="tab" aria-expanded="false" className="nav-link active p-0">
//                                             <h4 className="header-title">Create Role</h4>
//                                         </a>
//                                     </li>
//                                     <li className="nav-item">
//                                         <Link href="/admin/role" className="btn btn-primary mb-2 me-2"> View Role</Link>
//                                     </li>
//                                 </ul>
//                                 <div className="tab-content">
//                                     <div className="tab-pane show active" id="input-types-preview">
//                                         <form>
//                                             <div className="row">
//                                                 <div className="col-md-6">
//                                                     <div className="mb-3">
//                                                         <label htmlFor="simpleinput" className="form-label"><h6>Role Name</h6></label>
//                                                         <input
//                                                             {...register("roleName",
//                                                                 { required: { value: true, message: "Role name is required!" } }
//                                                             )}
//                                                             type="text" id="simpleinput" className={`form-control ${errors.roleName ? "border-danger" : ""}`}
//                                                             placeholder='Enter role name' />
//                                                         {
//                                                             errors.roleName && <span className="help-block text-danger"><small>{errors.roleName.message}</small></span>
//                                                         }
//                                                     </div>

//                                                 </div>

//                                             </div>
//                                         </form>
//                                     </div>
//                                 </div>
//                                 <ul className="nav nav-tabs nav-bordered mb-3 mt-3">
//                                     <li className="nav-item">
//                                         <a href="#" data-bs-toggle="tab" aria-expanded="false" className="nav-link active p-0">
//                                             <h4 className="header-title">Role Permissions</h4>
//                                         </a>

//                                     </li>
//                                 </ul>
//                                 <div className="tab-content">
//                                     <div className="tab-pane show active" id="input-types-preview">
//                                         {
//                                             menuData?.map((ele, ind) => {
//                                                 return (
//                                                     <Fragment key={ind}>
//                                                         <div className='d-flex justify-content-between'>
//                                                             <h6>{ele.menuName}</h6>
//                                                             <div className="form-group form-group-outline form-check pointer-cursor rounded">
//                                                                 <input type="checkbox" className="form-check-input pointer-cursor"
//                                                                     id={`selectAllService_${ind}`}
//                                                                     onChange={() => handleAllChecked(ind, ele._id, ele.service_1, ele.service_2, ele.service_3, ele.service_4, ele.service_5)}
//                                                                     checked={
//                                                                         Object.keys(ele)
//                                                                             .filter((key) => key.startsWith("service_") && ele[key])
//                                                                             .every((serviceKey) => permissions[ind]?.includes(ele[serviceKey]))
//                                                                     }

//                                                                 />

//                                                                 <label className="form-check-label pointer-cursor w-100" htmlFor={`selectAllService_${ind}`}>Select All</label>
//                                                             </div>
//                                                         </div>
//                                                         <div className="row ml-3 " >
//                                                             {
//                                                                 [1, 2, 3, 4, 5].map((e, i) => {
//                                                                     if (ele[`service_${e}`]) {
//                                                                         return (

//                                                                             <div className='col-12 col-md-6 col-xl-4' key={i}>
//                                                                                 <div className="form-group form-group-outline form-check pointer-cursor py-2 rounded bg-secondary">
//                                                                                     <input type="checkbox" className="form-check-input pointer-cursor"
//                                                                                         id={`${ele.menuName}_${e}`}
//                                                                                         onChange={() => handleChecked(ind, ele._id, ele[`service_${e}`])}
//                                                                                         value={ele[`service_${e}`]}
//                                                                                         checked={permissions[ind]?.includes(ele[`service_${e}`]) || false}
//                                                                                     />

//                                                                                     <label className="form-check-label pointer-cursor w-100" htmlFor={`${ele.menuName}_${e}`}>{ele[`service_${e}`]}</label>
//                                                                                     {/* <div className='checkbox-outline-label'></div> */}
//                                                                                 </div>
//                                                                             </div>

//                                                                         )
//                                                                     }
//                                                                 })
//                                                             }
//                                                         </div>
//                                                     </Fragment>
//                                                 )
//                                             })
//                                         }
//                                     </div>
//                                 </div>
//                                 <button className='mt-4 btn btn-primary' type='submit' disabled={isSubmitting}>
//                                      Submit
//                                 </button>

//                             </div>
//                         </div>
//                     </section >
//                 </div >
//             </div >
//         </>
//     )
// }

// export default Edit

import React from 'react'

const Edit = () => {
  return (
    <div>
     Edit Role
    </div>
  )
}

export default Edit
