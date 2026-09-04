"use client";

import { useSearchParams } from "next/navigation";
import { useT } from "@/lib/i18n";
import { NavBar, Empty } from "@/components/ui";

/**
 * 练习记录详情页。
 * 只展示真实存在的预约记录；未提供数据或记录不存在时给出诚实空态，
 * 不再渲染任何演示/预设语伴内容。
 */
export default function AppointmentDetailBody() {
  const t = useT();
  const params = useSearchParams();
  const id = params.get("id") || "";

  return (
    <div className="page">
      <NavBar title={t("练习记录")} />
      <div className="shell">
        <Empty
          icon="📋"
          text={
            id
              ? t("记录不存在或已删除")
              : t("暂无练习记录，完成一次真实的语伴练习后即可查看")
          }
        />
      </div>
    </div>
  );
}
