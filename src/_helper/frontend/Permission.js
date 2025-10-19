import { useContext } from "react";
import {PermissionContext} from "@/_context/PermissionContext";

  const usePermission = (menuId) => {
      const {permission} = useContext(PermissionContext)

      const getPermissionsBymenuId = (serviceNumber) => {
          const permissions = permission?.find((ele)=> ele.menuId === menuId)
          return permissions?.[serviceNumber] || null
      }
      const isLoaded = Array.isArray(permission) && permission.length > 0;

      return {getPermissionsBymenuId,isLoaded}
  }

export default usePermission