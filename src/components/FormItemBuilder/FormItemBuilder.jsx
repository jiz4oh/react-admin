import React from 'react'

import PolymorphicGrid from "@/lib/components/PolymorphicGrid";
import dispatcher from "./dispatcher";

function FormItemBuilder({ fields = [], columns, gutter, ...meta }) {
  return (
    <PolymorphicGrid columns={columns} gutter={gutter}>
      {fields.map(config => dispatcher(config, meta)).filter(Boolean)}
    </PolymorphicGrid>
  )
}

export default FormItemBuilder
